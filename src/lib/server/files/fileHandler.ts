import { Setting, settings } from '$lib/server/settings'
import type { User } from '@prisma/client'
import { uploadFile } from './mongo'
import db from '$lib/server/db'

function log(...message: any): void {
	console.log('[FileHandler]', message)
}

/**
 * Uploads a generic file to the server. This does not apply compression, so it is suitable for files like PDFs.
 * @param file The file to upload.
 * @returns The ID of the uploaded File.
 * @throws {Error} If file uploads are disabled.
 */
export async function uploadGenericFile(file: File, uploader: User): Promise<number> {
	if (settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		throw new Error('File uploads are disabled')
	}

	log('Uploading generic file', file.name)

	try {
		const f = await uploadFile(file, `${uploader.firstName}_${uploader.lastName}`)
	} catch (err) {
		log('Error uploading file', err)
		throw err
	}

	return 0
}

/**
 * Uploads a photo to the server. Automatically compresses the image.
 * @param file The photo to upload.
 * @param compress Whether to compress the image default true.
 * @returns The ID of the uploaded File.
 */
export function uploadPhoto(file: File, compress = true): number {
	if (settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		throw new Error('File uploads are disabled')
	}
	return 0
}
