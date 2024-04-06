import { GridFSBucket, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '$env/dynamic/private'
import sharp from 'sharp'

/**
 * MongoDB client instance.
 */
export const client = new MongoClient(env.MONGO_URI, {
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
export async function uploadFile(
	file: File,
	opts: { quality?: number; compress?: boolean } = { compress: true, quality: 75 },
): Promise<string> {
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

	let name = compressed ? file.name.replace(/\.\w+$/, '.jpeg') : file.name

	// check if name already exists and generate a new one like 'name-2.jpeg'
	let i = 1
	while (await bucket.find({ filename: name }).hasNext()) {
		name = `${name.replace(/\.\w+$/, '')}-${i++}.${name.split('.').pop()}`
	}

	bucket
		.openUploadStream(name, {
			metadata: {
				type: compressed ? 'image/jpeg' : file.type,
			},
		})
		.end(buffer)

	return name
}
