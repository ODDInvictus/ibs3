import { PrismaClient, File as IBSFile, Photo, Activity } from '../../../src/lib/server/prisma/client'
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { GridFSBucket, GridFSFile, MongoClient, ServerApiVersion } from 'mongodb'
import * as fs from 'fs'
import { pipeline } from 'stream/promises'
import sharp from 'sharp'
import { randomUUIDv7 } from 'bun'
import { getPhotoFilename } from '../../../src/lib/utils'

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE } = process.env

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_DATABASE) {
	console.error('Missing one of these requierd variables: DATABASE_ + [HOST, PORT, USER, PASSWORD, DATABASE]')
	process.exit(1)
}

const { MONGO_URI, MONGO_DB_NAME, MONGO_DB_BUCKET_NAME } = process.env

if (!MONGO_URI || !MONGO_DB_NAME || !MONGO_DB_BUCKET_NAME) {
	console.error('Missing one of these requierd variables: MONGO_ + [URI, DB_NAME, DB_BUCKET_NAME]')
	process.exit(1)
}

const TMP_FOLDER = './fotos'
const DRY_RUN = false

const adapter = new PrismaMariaDb(
	{
		host: DATABASE_HOST,
		port: Number.parseInt(DATABASE_PORT!),
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: DATABASE_DATABASE,
		connectionLimit: 5,
	},
	{ database: DATABASE_DATABASE! },
)

const prisma = new PrismaClient({
	adapter,
})

export const client = new MongoClient(MONGO_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})

export const mongo = client.db(MONGO_DB_NAME)

async function dumpFiles() {
	console.log('Dumping files')

	const bucket = new GridFSBucket(mongo, { bucketName: MONGO_DB_BUCKET_NAME })
	const cursor = bucket.find({})

	for await (const file of cursor) {
		console.log('')
		console.log(`Checking file ${file._id}`)

		const ibsFile = await prisma.file.findFirst({
			where: {
				id: file._id.toString(),
			},
		})

		if (!ibsFile) {
			console.log(`No IBSFile found for ${file._id}, skipping`)
			continue
		}

		// now check if it is a processed picture
		if (ibsFile.filename.includes('-normal') || ibsFile.filename.includes('-thumbnail')) {
			// these get reprocessed
			console.log(`Skipping preprocessed IBSPhoto ${file._id}`)
			if (!DRY_RUN) {
				await prisma.file.delete({
					where: {
						id: ibsFile.id,
					},
				})
			}

			continue
		}

		if (ibsFile.deleted) {
			console.log(`Not saving deleted file ${ibsFile.id}`)
			if (!DRY_RUN) {
				await prisma.file.delete({
					where: {
						id: ibsFile.id,
					},
				})
			}
			continue
		}

		const ibsPhoto = await prisma.photo.findFirst({
			where: {
				fileId: ibsFile.id,
			},
		})

		if (ibsPhoto) {
			console.log(`Original photo ${file._id}, reprocessing...`)
			// Original photo, reprocess this

			await reprocessPhoto(file, ibsFile, bucket, ibsPhoto)

			continue
		} else {
			const activity = await prisma.activity.findFirst({
				where: {
					photo: file.filename,
				},
			})

			if (activity) {
				console.log(`Old activity photo ${activity.id}, reprocessing...`)
				await reprocessPhoto(file, ibsFile, bucket, undefined, activity)
				continue
			} else {
				console.log(`Regular file ${file.filename}, writing to disk`)

				// regular file, only save this to disk
				const path = `${TMP_FOLDER}/${file.filename}`

				const downloadStream = bucket.openDownloadStream(file._id)
				const writeStream = fs.createWriteStream(path)

				await pipeline(downloadStream, writeStream)
				console.log(`Written ${file._id}`)
			}
		}
	}
}

async function reprocessPhoto(file: GridFSFile, ibsFile: IBSFile, bucket: GridFSBucket, ibsPhoto?: Photo, activity?: Activity) {
	const filename = `${randomUUIDv7()}_${ibsFile.filename}`
	const path = `${TMP_FOLDER}/${filename}`
	const withoutJpg = filename.replace('.jpg', '').replace('.jpeg', '')

	if (filename.endsWith('.mp4')) {
		console.log('chris heeft een mp4 geupload')
		if (!DRY_RUN) {
			await prisma.file.delete({
				where: {
					id: file._id.toString(),
				},
			})
		}
		return
	}

	const newFile = await prisma.file.create({
		data: {
			id: filename,
			filename,
			uploaderId: ibsFile.uploaderId,
			createdAt: ibsFile.createdAt,
		},
	})

	if (!ibsPhoto) {
		ibsPhoto = await prisma.photo.create({
			data: {
				uploaderId: newFile.uploaderId,
				creatorId: newFile.uploaderId,
				fileId: newFile.id,
				date: ibsFile.createdAt,
				visible: false,
				activityPhotoId: activity?.id ?? 1,
			},
		})

		await prisma.activity.update({
			where: {
				id: activity!.id,
			},
			data: {
				activityPhotoId: ibsPhoto.id,
			},
		})
	} else {
		const newStyleActivity = await prisma.activity.findFirst({
			where: {
				photo: ibsFile.filename,
			},
		})

		if (newStyleActivity) {
			console.log('Photo used in activity: ' + newStyleActivity.id)

			await prisma.activity.update({
				where: {
					id: newStyleActivity.id,
				},
				data: {
					activityPhotoId: ibsPhoto.id,
				},
			})
		}
	}

	await prisma.photo.update({
		where: {
			id: ibsPhoto.id,
		},
		data: {
			fileId: newFile.id,
		},
	})

	const downloadStream = bucket.openDownloadStream(file._id)
	const writeStream = fs.createWriteStream(path)

	await pipeline(downloadStream, writeStream)

	const normalFilename = getPhotoFilename(withoutJpg, 'normal')
	const thumbFilename = getPhotoFilename(withoutJpg, 'thumbnail')

	try {
		const normal = await sharp(path)
			.withMetadata()
			.resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
			.avif({ quality: 90 })
			.toBuffer()

		await Bun.write(`${TMP_FOLDER}/${normalFilename}`, normal)

		await prisma.file.create({
			data: {
				id: normalFilename,
				filename: normalFilename,
				uploaderId: ibsPhoto.uploaderId,
			},
		})

		const thumb = await sharp(path)
			.withMetadata()
			.resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
			.avif({ quality: 90 })
			.toBuffer()

		await Bun.write(`${TMP_FOLDER}/${thumbFilename}`, thumb)
	} catch (err) {
		console.error()
	}

	if (!DRY_RUN) {
		await prisma.file.create({
			data: {
				id: thumbFilename,
				filename: thumbFilename,
				uploaderId: ibsPhoto.uploaderId,
			},
		})

		// Delete original file
		await prisma.file.delete({
			where: {
				id: ibsFile.id,
			},
		})
	}
}

async function main() {
	await dumpFiles()
}

main()
	.catch(async e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
		await client.close()
	})
