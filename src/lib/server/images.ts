import type { Photo, PhotoCreator, User } from '@prisma/client'
import db from './db'
import redis, { createRedisJob } from './cache'
import fs from 'fs/promises'

export type PhotoSize = 'small' | 'medium' | 'large' | 'original'

const uploadFolder = process.env.UPLOAD_FOLDER

export async function getPhotoCreator(user: User, other: boolean, name?: string): Promise<PhotoCreator> {
	let c

	if (other) {
		if (!name) {
			throw new Error('Name is missing in getPhotoCreator')
		}

		c = await db.photoCreator.upsert({
			update: {},
			create: {
				name,
			},
			where: {
				name,
			},
		})
	} else {
		name = user.firstName + ' ' + user.lastName
		c = await db.photoCreator.upsert({
			update: {},
			create: {
				name,
				user: {
					connect: {
						ldapId: user.ldapId,
					},
				},
			},
			where: {
				name,
				user: {
					ldapId: user.ldapId,
				},
			},
		})
	}

	return c
}

type UploadPhotoArgs = {
	upload: {
		filename: string
		buf: Buffer
	}
	additionalName?: string
	runProcessingJob?: boolean
	creator: PhotoCreator
	uploader: User
	invisible?: boolean
}

/**
 * Upload een foto
 * @param args Argumenten enzo
 * @param tx PrismaClient
 * @returns
 */
export async function uploadPhoto(args: UploadPhotoArgs, transactionClient?: any): Promise<Photo> {
	const date = Date.now()
	// Take filename, buf, creator from args
	const { filename, buf } = args.upload
	const { creator } = args

	// If there is not an extension, just assume jpeg
	const extension = filename.split('.').pop() || 'jpeg'
	const creatorName = creator.name.split(' ').join('_')

	let filenameOnDisk = `Invictus${args.additionalName ? `-${args.additionalName}` : ''}-${creatorName}-${date}`

	const invisible = args.invisible || false

	let response

	try {
		if (transactionClient) {
			response = await transaction(transactionClient, filenameOnDisk, extension, creatorName, date, args, creator, invisible)
		} else {
			await db.$transaction(async tx => {
				response = await transaction(tx, filenameOnDisk, extension, creatorName, date, args, creator, invisible)
			})
		}
	} catch (err) {
		console.error(err)
		throw err
	}

	let photo = response?.photo
	filenameOnDisk = response?.filenameOnDisk || ''

	// Write the file to disk
	await fs.writeFile(`${uploadFolder}/${filenameOnDisk}.${extension}`, buf).catch(err => {
		photo = undefined
		console.error('------------------------------')
		console.error('[PHOTO-SAVE]' + err)
		console.error('------------------------------')
	})

	if (!photo) {
		throw new Error('Photo saving failed')
	}

	if (args.runProcessingJob) {
		await createRedisJob('photo-processing')
	}

	return photo
}

type TransactionReturnType = {
	photo: Photo
	filenameOnDisk: string
}

async function transaction(
	tx: any,
	filenameOnDisk: string,
	extension: string,
	creatorName: string,
	date: number,
	args: UploadPhotoArgs,
	creator: PhotoCreator,
	invisible: boolean,
): Promise<TransactionReturnType> {
	let photo = await tx.photo.create({
		data: {
			filename: filenameOnDisk,
			extension,
			processed: false,
			uploaderId: args.uploader.id,
			creatorId: creator.id,
			date: new Date(),
			visible: !invisible,
		},
	})

	filenameOnDisk = `Invictus${args.additionalName ? `-${args.additionalName}` : ''}-${creatorName}-${date}-${photo.id}`

	await tx.photo.update({
		where: {
			id: photo.id,
		},
		data: {
			filename: filenameOnDisk,
		},
	})

	return { photo, filenameOnDisk }
}

export async function loadPhotoById(id: number, size: PhotoSize = 'large'): Promise<LoadPhotoType | null> {
	const p = await db.photo.findUnique({
		where: {
			id,
		},
	})

	if (!p) return null

	return await loadPhoto(p, size)
}

type ContentType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif' | 'image/svg+xml'

type LoadPhotoType = {
	buffer: Buffer
	contentType: ContentType
}

export async function loadPhoto(photo: Photo, size: PhotoSize = 'large'): Promise<LoadPhotoType> {
	// First check the cache
	const cachedFile = await redis.get(`file:${photo.id}:${size}`)

	const ct = size === 'original' ? extToContentType(photo.extension) : 'image/avif'

	if (cachedFile) {
		return {
			buffer: Buffer.from(cachedFile, 'binary'),
			contentType: ct,
		}
	}

	const path = uploadFolder
	// Cache the image for a week
	const cacheTime = !!process.env.IMAGE_CACHE_TIME ? parseInt(process.env.IMAGE_CACHE_TIME) : 60 * 60 * 24 * 7

	if (!path) {
		throw new Error('Missing env.PHOTO_PATH')
	}

	let fullPath = `${path}/${photo.filename}-${size}.avif`

	// If we want the original image, discard the size param and use the original extension
	if (size === 'original') {
		fullPath = `${path}/${photo.filename}.${photo.extension}`
	}

	// Load the file from disk
	const file = await fs.readFile(fullPath)

	// Cache the file
	redis.set(`file:${photo.id}:${size}`, file.toString('binary'), 'EX', cacheTime)

	return {
		buffer: file,
		contentType: ct,
	}
}

function extToContentType(ext: string): ContentType {
	switch (ext) {
		case 'jpg' || 'jpeg':
			return 'image/jpeg'
		case 'png':
			return 'image/png'
		case 'webp':
			return 'image/webp'
		case 'avif':
			return 'image/avif'
		case 'gif':
			return 'image/gif'
		case 'svg':
			return 'image/svg+xml'
		default:
			return 'image/jpeg'
	}
}
