import { GridFSBucket, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '$env/dynamic/private'
import sharp from 'sharp'
import { Setting, settings } from '../settings'

/**
 * MongoDB client instance.
 */
export const client = new MongoClient(env.MONGO_URI || 'mongodb://localhost:27017/ibs3', {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})

/**
 * MongoDB database instance.
 */
export const mongo = client.db(env.MONGO_DB_NAME)

/**
 * Uploads a file to MongoDB GridFS.
 * @param file The file to upload.
 * @param opts Options for file compression and quality.
 * @param opts.quality The quality of the compressed image (0-100) default 75.
 * @param opts.compress Whether to compress the image default true.
 * @returns The name of the uploaded file.
 *
 * @example
 * ```ts
 * const name = await uploadFile(file, { quality: 75, compress: true });
 * console.log(`Uploaded file: ${name}`);
 * ```
 */
export async function uploadFile(file: File, uploaderName: string) {
	if (!env.MONGO_URI || !settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		console.log('Tried uploading a file but MongoDB is not connected or FILE_UPLOAD_DISABLED is set to true.')
		return ''
	}

	let buffer = Buffer.from(await file.arrayBuffer())
	const bucket = new GridFSBucket(mongo)

	let filename = `Invictus_${uploaderName}_${Date.now()}_${file.name}`

	bucket
		.openUploadStream(filename, {
			metadata: {
				type: file.type,
			},
		})
		.end(buffer)

	return { filename, type: file.type, size: buffer.length }
}

/**
 * Deletes a file from the MongoDB GridFS bucket.
 * @param filename - The name of the file to be deleted.
 * @returns A Promise that resolves when the file is successfully deleted.
 */
export async function deleteFile(filename: string): Promise<void> {
	const bucket = new GridFSBucket(mongo, { bucketName: 'fs' })
	const file = await bucket.find({ filename }).next()
	if (!file) return
	await bucket.delete(file._id)
}
