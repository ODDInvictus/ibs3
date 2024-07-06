import { GridFSBucket, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '$env/dynamic/private'
import { Setting, settings } from '../settings'
import { GridFSPromise } from 'gridfs-promise'

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

export const gridFS = new GridFSPromise(env.MONGO_DB_NAME || 'ibs3', env.MONGO_URI, {}, env.MONGO_DB_BUCKET_NAME || 'ibs3-fs')

type UploadedFile = {
	filename: string
	mongoID: string
}

/**
 * Uploads a file to MongoDB GridFS.
 * @param file The file to upload.
 * @param opts Options for file compression and quality.
 * @returns The MongoDB ID of the uploaded file.
 *
 * @example
 * ```ts
 * const name = await uploadFile(file, { quality: 75, compress: true });
 * console.log(`Uploaded file: ${name}`);
 * ```
 */
export async function _uploadFile(file: File, uploaderName: string): Promise<UploadedFile> {
	if (!env.MONGO_URI || settings.getBool(Setting.FILE_UPLOAD_DISABLED, false)) {
		throw new Error('Tried uploading a file but MongoDB is not connected or FILE_UPLOAD_DISABLED is set to true.')
	}

	let buffer = Buffer.from(await file.arrayBuffer())
	// const bucket = new GridFSBucket(mongo)

	let normalizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
	let filename = `Invictus_${uploaderName}_${Date.now()}_${normalizedFileName}`

	const object = await gridFS.uploadFileString(buffer.toString('base64'), filename, file.type, {})

	// const stream = bucket
	// 	.openUploadStream(filename, {
	// 		metadata: {
	// 			type: file.type,
	// 			processed: false
	// 		}
	// 	})
	// 	.end(buffer)

	console.log(`Uploaded file: ${filename} with id ${object._id}`)

	return {
		mongoID: object._id.toString(),
		filename,
	}
}

export async function _getFileStream(filename: string) {
	const bucket = new GridFSBucket(mongo, { bucketName: env.MONGO_DB_BUCKET_NAME || 'ibs3-fs' })
	const cursor = bucket.find({ filename })
	const doc = await cursor.next()

	if (!doc) return null

	return { doc, stream: bucket.openDownloadStreamByName(filename) }
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
