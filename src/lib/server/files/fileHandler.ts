import { Setting, settings } from '$lib/server/settings'
import type { User } from '@prisma/client'
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
export async function uploadGenericFile(file: File, uploader: string): Promise<number> {
	if (settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	log('Uploading generic file', file.name)

	const f = await _uploadFile(file, uploader)

	const fileId = await db.file.create({
		data: {
			filename: f,
		},
	})

	return fileId.id
}

/**
 * Uploads a photo to the server. Automatically compresses the image.
 * @param file The photo to upload.
 * @param uploader The user uploading the photo.
 * @param compress Whether to compress the image default true.
 * @returns The ID of the uploaded File.
 */
export async function uploadPhoto(file: File, uploader: string, compress = true): Promise<number> {
	if (settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	const f = await uploadGenericFile(file, uploader)

	if (compress) {
		await compressImage(f)
	}

	return f
}

/**
 * Get a file-stream from mongo
 *
 * See /(app)/file/[filename] for an example of how to use this
 * @param fileId The ID of the file to get
 * @returns Filestream + metadata
 *
 */
export async function getFile(fileId: number) {
	const file = await db.file.findUnique({
		where: {
			id: fileId,
		},
	})

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
