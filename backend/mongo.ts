import { prisma } from './prisma'
import { GridFSBucket, GridFSBucketReadStream, MongoClient, ObjectId } from 'mongodb'

export const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/ibs3')

export const mongo = client.db(process.env.MONGO_DB_NAME)

export const bucket = new GridFSBucket(mongo, {
	bucketName: process.env.MONGO_DB_BUCKET_NAME || 'ibs3-fs',
})

export async function getFileData(filename: string): Promise<Buffer> {
	const stream = await getFileStream(filename)

	return new Promise((resolve, reject) => {
		let data = ''

		stream.on('data', chunk => {
			data += chunk.toString('base64')
		})

		stream.on('end', () => {
			resolve(Buffer.from(data, 'base64'))
		})

		stream.on('error', err => {
			reject(err)
		})
	})
}

export async function getFileStream(filename: string): Promise<GridFSBucketReadStream> {
	const file = await prisma.file.findFirst({
		where: {
			filename,
		},
	})

	if (!file) {
		throw new Error(`File ${filename} not found in database`)
	}

	return bucket.openDownloadStreamByName(filename)
}

export async function uploadFile(buffer: Buffer, filename: string): Promise<ObjectId> {
	const uploadStream = bucket.openUploadStream(filename)
	uploadStream.end(buffer)
	return new Promise((resolve, reject) => {
		uploadStream.on('finish', () => {
			resolve(uploadStream.id)
		})
		uploadStream.on('error', reject)
	})
}
