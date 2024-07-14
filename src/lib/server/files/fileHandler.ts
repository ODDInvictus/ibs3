import { Setting, settings } from '$lib/server/settings'
import type { File as IBSFile, User } from '@prisma/client'
import { _getFileStream, _uploadFile } from './mongo'
import db from '$lib/server/db'
import { compressImage } from './sharp'

function log(...message: any): void {
	console.log('[FileHandler]', ...message)
}

/**
 * Uploads a generic file to the server. This does not apply compression, so it is suitable for files like PDFs.
 * @param file The file to upload.
 * @param uploader The user uploading the file.
 * @returns The ID of the uploaded File.
 * @throws {Error} If file uploads are disabled.
 */
export async function uploadGenericFile(file: File, uploader: User): Promise<string> {
	if (!settings.getBool(Setting.FILE_UPLOAD_ENABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	log('Uploading file', file.name)

	const f = await _uploadFile(file, uploader.ldapId)

	await db.file.create({
		data: {
			filename: f.filename,
			id: f.mongoID,
			uploaderId: uploader.id,
		},
	})

	return f.filename
}

/**
 * Uploads a photo to the server. Automatically compresses the image.
 * @param file The photo to upload.
 * @param uploader The user uploading the photo.
 * @returns The ID of the uploaded File.
 */
export async function uploadPhoto(file: File, uploader: User, visible?: boolean, returnPhotoId?: boolean, creator?: User): Promise<string> {
	if (!settings.getBool(Setting.FILE_UPLOAD_ENABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	const f = await uploadGenericFile(file, uploader)

	await compressImage(f)

	console.log(f, visible)

	let photoCreateObject = {
		date: new Date(),
		visible: visible === true,
		file: {
			connect: {
				filename: f,
			},
		},
		uploader: {
			connect: {
				id: uploader.id,
			},
		},
	}

	if (creator) {
		photoCreateObject = Object.assign(
			{
				creator: {
					connect: {
						id: creator.id,
					},
				},
			},
			photoCreateObject,
		)
	}

	// Now create the photo object
	const photoId = await db.photo.create({
		data: photoCreateObject,
	})

	if (returnPhotoId) {
		return '' + photoId.id
	}

	return f
}

async function _getFile(file: IBSFile | null) {
	if (!file) {
		return null
	}

	const str = await _getFileStream(file.filename)

	if (!str) {
		return null
	}

	return {
		file,
		stream: str.stream,
		doc: str.doc,
	}
}

/**
 * Get a file-stream from mongo
 *
 * See /(app)/file/[filename] for an example of how to use this
 * @param fileId The ID of the file to get
 * @returns Filestream + metadata
 *
 */
export async function getFile(fileId: string) {
	const file = await db.file.findUnique({
		where: {
			id: fileId,
		},
	})

	return _getFile(file)
}

/**
 * Get a file-stream from mongo
 *
 * See /(app)/file/[filename] for an example of how to use this
 * @param fileId The filename of the file to get
 * @returns Filestream + metadata
 *
 */
export async function getFileByFilename(filename: string) {
	const file = await db.file.findUnique({
		where: {
			filename,
		},
	})

	return _getFile(file)
}

type PhotoQuality = 'thumbnail' | 'normal' | 'original'

/**
 * Get a file-stream from mongo
 *
 * See /(app)/file/[filename] for an example of how to use this
 * @param fileId The ID of the file to get
 * @param quality The quality of the image (defaults to large)
 * @returns Filestream + metadata
 *
 */
export async function getPhoto(filename: string, quality: PhotoQuality = 'normal') {
	const spl = filename.split('.')
	const ext = spl.pop()

	if (!ext) {
		throw new Error('Invalid filename')
	}

	const fn = spl + '-' + quality + '.' + ext

	const file = await db.file.findUnique({
		where: {
			filename: fn,
		},
	})

	return _getFile(file)
}

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
