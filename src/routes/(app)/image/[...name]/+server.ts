import type { RequestHandler } from './$types'
import { env } from '$env/dynamic/private'
import fs from 'fs/promises'
import redis from '$lib/server/cache'
import sharp from 'sharp'
import db from '$lib/server/db'
import type { Photo } from '@prisma/client'

const UPLOAD_FOLDER = env.UPLOAD_FOLDER
const STATIC_FOLDER = env.STATIC_FOLDER || './static'
const IMAGE_CACHE_TIME = env.IMAGE_CACHE_TIME ?? 1

const SIZES = ['small', 'medium', 'large', 'original']

export const GET: RequestHandler = async ({ request, params, setHeaders, url }) => {
	// First get the filename from the request

	let filename = params.name

	// Does the query contain a size?
	let size = url.searchParams.get('size')

	// If the size param is set, but it is not in the form of 100x100, or 'small' etc., return 404
	// if (size && (!size.includes('x') && !SIZES.includes(size.split('x')[1]))) {
	if (size && !SIZES.includes(size) && !size.includes('x')) {
		return new Response('Illegal size parameter: ' + size, { status: 404 })
	}

	if (!size) size = 'large'

	let isStatic = url.searchParams.get('static') === 'true'

	// Then get the file from the server

	const agent = request.headers.get('user-agent')

	const path = isStatic ? STATIC_FOLDER : UPLOAD_FOLDER

	try {
		if (filename.startsWith('id/')) {
			return new Response('Endpoint not in use', { status: 404 })
		}

		// First check if we have the file in the cache
		let cachedFile
		if (env.DISABLE_REDIS !== 'true') {
			cachedFile = await redis.get(`file:${filename}:${size}`)
		}

		if (cachedFile) {
			let buf = Buffer.from(cachedFile, 'binary')
			let ct = 'image/avif'

			if (agent && (agent.includes('Edg/') || agent.includes('Edge'))) {
				buf = await sharp(buf).jpeg({ mozjpeg: true, quality: 75 }).toBuffer()
				ct = 'image/jpeg'
			}

			setHeaders({
				'Content-Type': ct,
				'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`,
			})

			return new Response(buf)
		}

		// We do not have the file in the cache, so we need to read it from disk

		let buf: Buffer | null = null

		if (SIZES.includes(size)) {
			// These images have been premade, so we can just read them from disk

			if (size === 'original') {
				// If size is set to original, the /id/ route should be used instead
				return new Response('Can not use size=original with this endpoint, use /image/id/{photo_id} or size=large instead', { status: 405 })
			}

			if (isStatic) {
				buf = await readImage(path, filename)
			} else {
				buf = await readImage(path, `${filename}-${size}.avif`)
			}
		} else if (size.includes('x')) {
			// These are done dynamically, so we need to read whatever size is closest and resize it
			const sizeToLoad = getBestImageSizeToLoad(size)

			let photo: Buffer
			if (isStatic) {
				photo = await readImage(path, filename)
			} else {
				photo = await readImage(path, `${filename}-${sizeToLoad}.avif`)
			}

			buf = await resizeImage(photo, size)
		}

		// 404, since if size is not set, it defaults to large, thus buf will not be null then
		if (!buf) {
			console.log('404')
			return new Response('File not found', { status: 404 })
		}

		if (env.DISABLE_REDIS !== 'true') {
			redis.set(`file:${filename}:${size}`, buf.toString('binary'), 'EX', IMAGE_CACHE_TIME)
		}

		let contentType = 'image/avif'

		if (agent && (agent.includes('Edg/') || agent.includes('Edge'))) {
			buf = await sharp(buf).jpeg({ mozjpeg: true, quality: 75 }).toBuffer()
			contentType = 'image/jpeg'
		}

		setHeaders({
			'Content-Type': contentType,
			'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`,
		})
		return new Response(buf)
	} catch (err) {
		console.log('[IMAGE] Not found: ' + filename)
		return new Response('File not found', { status: 404 })
	}
}

async function readImage(path: string, name: string): Promise<Buffer> {
	return await fs.readFile(`${path}/${name}`)
}

async function readJpeg(path: string, name: string, size: string | undefined): Promise<Buffer> {
	const file = await fs.readFile(`${path}/${name}-large.avif`)

	if (size) {
		const [width, height] = size.split('x')

		return await sharp(file).resize(parseInt(width), parseInt(height)).jpeg({ mozjpeg: true, quality: 75 }).toBuffer()
	}

	return await sharp(file).jpeg({ mozjpeg: true, quality: 75 }).toBuffer()
}

async function cacheImage(filename: string, size: string, buf: Buffer) {
	if (env.DISABLE_REDIS !== 'true') {
		redis.set(`file:${filename}:${size}`, buf.toString('binary'), 'EX', IMAGE_CACHE_TIME)
	}
}

async function getImageFromCache(filename: string, size: string): Promise<Buffer | null> {
	let cachedFile
	if (env.DISABLE_REDIS !== 'true') {
		cachedFile = await redis.get(`file:${filename}:${size}`)
	}

	if (!cachedFile) return null

	return Buffer.from(cachedFile, 'binary')
}

function getBestImageSizeToLoad(size: string): string {
	const [width, height] = size.split('x')

	let largestSide = Number(width)

	if (height > width) {
		largestSide = Number(height)
	}

	let sizeToLoad = 'large'

	if (largestSide < 800) {
		sizeToLoad = 'small'
	} else if (largestSide < 1600) {
		sizeToLoad = 'medium'
	}

	return sizeToLoad
}

function resizeImage(buf: Buffer, size: string): Promise<Buffer> {
	const [width, height] = size.split('x')

	return sharp(buf).resize(parseInt(width), parseInt(height)).avif({ quality: 70 }).toBuffer()
}

type PhotoSize = 'small' | 'medium' | 'large' | 'original'

const uploadFolder = process.env.UPLOAD_FOLDER

// // export async function getPhotoCreator(user: User, other: boolean, name?: string): Promise<PhotoCreator> {
// // 	let c

// // 	if (other) {
// // 		if (!name) {
// // 			throw new Error('Name is missing in getPhotoCreator')
// // 		}

// // 		c = await db.photoCreator.upsert({
// // 			update: {},
// // 			create: {
// // 				name,
// // 			},
// // 			where: {
// // 				name,
// // 			},
// // 		})
// // 	} else {
// // 		name = user.firstName + ' ' + user.lastName
// // 		c = await db.photoCreator.upsert({
// // 			update: {},
// // 			create: {
// // 				name,
// // 				user: {
// // 					connect: {
// // 						ldapId: user.ldapId,
// // 					},
// // 				},
// // 			},
// // 			where: {
// // 				name,
// // 				user: {
// // 					ldapId: user.ldapId,
// // 				},
// // 			},
// // 		})
// // 	}

// // 	return c
// // }

// type UploadPhotoArgs = {
// 	upload: {
// 		filename: string
// 		buf: Buffer
// 	}
// 	additionalName?: string
// 	runProcessingJob?: boolean
// 	creator: PhotoCreator
// 	uploader: User
// 	invisible?: boolean
// }

// /**
//  * Upload een foto
//  * @param args Argumenten enzo
//  * @param tx PrismaClient
//  * @returns
//  */
// export async function uploadPhoto(args: UploadPhotoArgs, transactionClient?: any): Promise<Photo> {
// 	const date = Date.now()
// 	// Take filename, buf, creator from args
// 	const { filename, buf } = args.upload
// 	const { creator } = args

// 	// If there is not an extension, just assume jpeg
// 	const extension = filename.split('.').pop() || 'jpeg'
// 	const creatorName = creator.name.split(' ').join('_')

// 	let filenameOnDisk = `Invictus${args.additionalName ? `-${args.additionalName}` : ''}-${creatorName}-${date}`

// 	const invisible = args.invisible || false

// 	let response

// 	try {
// 		if (transactionClient) {
// 			response = await transaction(transactionClient, filenameOnDisk, extension, creatorName, date, args, creator, invisible)
// 		} else {
// 			await db.$transaction(async tx => {
// 				response = await transaction(tx, filenameOnDisk, extension, creatorName, date, args, creator, invisible)
// 			})
// 		}
// 	} catch (err) {
// 		console.error(err)
// 		throw err
// 	}

// 	let photo = response?.photo
// 	filenameOnDisk = response?.filenameOnDisk || ''

// 	// Write the file to disk
// 	await fs.writeFile(`${uploadFolder}/${filenameOnDisk}.${extension}`, buf).catch(err => {
// 		photo = undefined
// 		console.error('------------------------------')
// 		console.error('[PHOTO-SAVE]' + err)
// 		console.error('------------------------------')
// 	})

// 	if (!photo) {
// 		throw new Error('Photo saving failed')
// 	}

// 	// if (args.runProcessingJob) {
// 		// await createRedisJob('photo-processing')
// 	// }

// 	return photo
// }

// type TransactionReturnType = {
// 	photo: Photo
// 	filenameOnDisk: string
// }

// async function transaction(
// 	tx: any,
// 	filenameOnDisk: string,
// 	extension: string,
// 	creatorName: string,
// 	date: number,
// 	args: UploadPhotoArgs,
// 	creator: PhotoCreator,
// 	invisible: boolean,
// ): Promise<TransactionReturnType> {
// 	let photo = await tx.photo.create({
// 		data: {
// 			filename: filenameOnDisk,
// 			extension,
// 			processed: false,
// 			uploaderId: args.uploader.id,
// 			creatorId: creator.id,
// 			date: new Date(),
// 			visible: !invisible,
// 		},
// 	})

// 	filenameOnDisk = `Invictus${args.additionalName ? `-${args.additionalName}` : ''}-${creatorName}-${date}-${photo.id}`

// 	await tx.photo.update({
// 		where: {
// 			id: photo.id,
// 		},
// 		data: {
// 			filename: filenameOnDisk,
// 		},
// 	})

// 	return { photo, filenameOnDisk }
// }
