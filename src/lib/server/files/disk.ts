import { env } from '$env/dynamic/private'
import db from '$lib/server/db'
import { randomUUIDv7 } from 'bun'
import type { File as IBSFile, Photo } from '../prisma/client'
import { Setting, settings } from '../settings'
import sharp from 'sharp'
import { getPhotoFilename, type PhotoQuality } from '$lib/utils'

export type ResizeDirection = 90 | 180 | 270

/**
 * Rotate 'normal' and 'thumbnail' quality photos
 * @param file File to rotate
 * @param to degrees to rotate
 * @throws Error if normal/thumbnails cannot be read. This can indicate that processing has not occured, or this was not called on a Photo
 */
export async function rotatePhoto(file: IBSFile, to: ResizeDirection): Promise<void> {
	const filenameNormal = _getPhotoFilename(file.filename, 'normal')
	const filenameThumb = _getPhotoFilename(file.filename, 'thumbnail')
	const normal = await readFileByFilename(filenameNormal)
	const thumb = await readFileByFilename(filenameThumb)

	if (!normal || !thumb) {
		throw new Error(`File ${file.id} does not exist`)
	}

	const oldNormal = Bun.file(filenameNormal)
	await oldNormal.delete()
	sharp(Buffer.from(normal)).rotate(to).toFile(filenameNormal)

	const oldThumb = Bun.file(filenameThumb)
	await oldThumb.delete()
	sharp(Buffer.from(thumb)).rotate(to).toFile(filenameThumb)
}

/**
 * Uploads a file without any post-processing
 * @param file A Bun.File object, to upload
 * @param uploaderId User.id of the uploader, can be undefined
 * @throws Error if Setting.FILE_UPLOAD_ENABLED is false, or if env.FILE_LOCATION is unset
 * @returns Promise<IBSFile> File upload metadata
 */
export async function uploadGenericFile(file: File, uploaderId?: number): Promise<IBSFile> {
	log('Uploading file', file.name)

	const filename = `${randomUUIDv7()}_${file.name}`
	const buffer = Buffer.from(await file.arrayBuffer())

	await _writeBuffer(filename, buffer)

	log('Uploaded file: ', filename)

	const f = await db.file.create({
		data: {
			id: filename,
			filename,
			uploaderId,
		},
	})

	return f
}

/**
 * Uploads a photo with post-processing
 * @param file A Bun.File object, to upload
 * @param uploaderId User.id of the uploader, can be undefined
 * @throws Error if Setting.FILE_UPLOAD_ENABLED is false, or if env.FILE_LOCATION is unset
 * @returns Promise<Photo> Photo object
 */
export async function uploadPhoto(file: File, uploaderId: number, visible?: boolean, creatorId?: number): Promise<Photo> {
	const original = await uploadGenericFile(file, uploaderId)

	const buffer = Buffer.from(await file.arrayBuffer())

	const normal = await sharp(buffer)
		.withMetadata()
		.resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
		.avif({ quality: 90 })
		.toBuffer()
	const normalFilename = _getPhotoFilename(original.filename, 'normal')
	await _writeBuffer(normalFilename, Buffer.from(normal))

	await db.file.create({
		data: {
			id: normalFilename,
			filename: normalFilename,
			uploaderId,
		},
	})

	const thumb = await sharp(buffer)
		.withMetadata()
		.resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
		.avif({ quality: 90 })
		.toBuffer()

	const thumbFilename = _getPhotoFilename(original.filename, 'thumbnail')
	await _writeBuffer(thumbFilename, Buffer.from(thumb))

	await db.file.create({
		data: {
			id: thumbFilename,
			filename: thumbFilename,
			uploaderId,
		},
	})

	const photo = await db.photo.create({
		data: {
			date: new Date(),
			visible,
			fileId: original.id,
			uploaderId,
			creatorId,
		},
	})

	return photo
}

/**
 * Read a photo from disk by filename and quality
 * @returns Promise<ArrayBuffer | undefined> The file represented as an ArrayBuffer, undefined if file not found
 */
export async function readPhotoByFilename(filename: string, quality: PhotoQuality): Promise<ArrayBuffer | undefined> {
	return readFileByFilename(_getPhotoFilename(filename, quality))
}

/**
 * Read a file from disk by file object
 * @returns Promise<ArrayBuffer | undefined> The file represented as an ArrayBuffer, undefined if file not found
 */
export async function readFile(file: IBSFile): Promise<ArrayBuffer | undefined> {
	return _readFile(file)
}

/**
 * Read a file from disk by filename
 * @returns Promise<ArrayBuffer | undefined> The file represented as an ArrayBuffer, undefined if file not found
 */
export async function readFileByFilename(filename: string): Promise<ArrayBuffer | undefined> {
	const file = await db.file.findUnique({
		where: {
			filename,
		},
	})

	if (!file) {
		return undefined
	}

	return _readFile(file)
}

export async function deletePhoto(photo: Photo) {
	log(`Deleting photo ${photo.id}`)
	const file = await db.file.findFirst({ where: { id: photo.fileId } })

	if (!file) return

	const normalFilename = _getPhotoFilename(file.filename, 'normal')
	const thumbFilename = _getPhotoFilename(file.filename, 'thumbnail')

	await hardDeleteFile(normalFilename)
	await hardDeleteFile(thumbFilename)
	await hardDeleteFile(file.filename)
}

/**
 * Hard delete a file
 * @param filename
 */
export async function hardDeleteFile(filename: string) {
	const path = env.FILE_LOCATION

	if (!path) {
		log(`Requesting file ${filename} but env.FILE_LOCATION unset`)
		return undefined
	}

	const file = Bun.file(`${path}/${filename}`)

	if (await file.exists()) {
		await deleteFile(filename)
		await file.delete()
	}
}

/**
 * "Delete" a file
 * @param filename
 */
export async function deleteFile(filename: string) {
	// Soft delete
	return await db.file.update({
		where: {
			filename,
		},
		data: {
			deletedAt: new Date(),
			deleted: true,
		},
	})
}

function _getPhotoFilename(filename: string, quality: PhotoQuality): string {
	return getPhotoFilename(filename, quality)
}

async function _readFile(fileObject: IBSFile): Promise<ArrayBuffer | undefined> {
	const path = env.FILE_LOCATION

	if (!path) {
		log(`Requesting file ${fileObject.filename} but env.FILE_LOCATION unset`)
		return undefined
	}

	const file = Bun.file(`${path}/${fileObject.filename}`)

	if (await file.exists()) {
		return await file.arrayBuffer()
	}

	return undefined
}

async function _writeBuffer(filename: string, buf: Buffer<ArrayBuffer>): Promise<void> {
	if (!settings.getBool(Setting.FILE_UPLOAD_ENABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	if (!env.FILE_LOCATION) {
		throw new Error('env.FILE_LOCATION not set, cannot upload file')
	}

	await Bun.write(`${env.FILE_LOCATION}/${filename}`, buf, { createPath: true })
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Disk][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}
