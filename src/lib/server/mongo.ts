import { GridFSBucket, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '$env/dynamic/private'
import sharp from 'sharp'

/**
 * MongoDB client instance.
 */
export const client = new MongoClient(env.MONGO_URI!, {
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
export async function uploadFile(file: File, opts: { quality?: number; compress?: boolean } = { compress: true, quality: 75 }) {
	let buffer = Buffer.from(await file.arrayBuffer())

	const compressableTypes = ['image/jpeg', 'image/png', 'image/avif', 'image/tiff', 'image/webp']
	let compressed = false
	if (compressableTypes.includes(file.type) && opts.compress) {
		try {
			buffer = await sharp(buffer)
				.jpeg({ mozjpeg: true, quality: opts.quality ?? 75 })
				.toBuffer()
			compressed = true
		} catch (err) {
			console.error(err)
		}
	}

	const bucket = new GridFSBucket(mongo)

	let filename = compressed ? file.name.replace(/\.\w+$/, '.jpeg') : file.name

	// check if name already exists and generate a new one like 'name-2.jpeg'
	let i = 1
	while (await bucket.find({ filename: filename }).hasNext()) {
		filename = `${filename.replace(/\.\w+$/, '')}-${i++}.${filename.split('.').pop()}`
	}

	const type = compressed ? 'image/jpeg' : file.type

	bucket
		.openUploadStream(filename, {
			metadata: {
				type,
			},
		})
		.end(buffer)

	return { filename, type, size: buffer.length }
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
