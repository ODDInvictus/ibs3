import sharp from 'sharp'
import { getFileData, uploadFile } from './mongo'
import { prisma } from './prisma'
import { File } from '@prisma/client'

type ImageProcessingJob = {
	name: string
	data: string
	date: number
	type: string
}

async function compressImage(msg: ImageProcessingJob) {
	const spl = msg.data.split(',')

	const name = spl[0]
	const extSpl = name.split('.')
	const ext = extSpl[1]
	const filename = extSpl[0]
	const ratio = Number.parseFloat(spl[1])

	const job = await prisma.job.findFirst({
		where: {
			name: msg.name,
		},
	})

	if (!job) {
		console.error(`[REDIS] Job from ${msg} not found`)
		return
	}

	const originalFile = await prisma.file.findFirst({
		where: {
			filename: name,
		},
	})

	if (!originalFile) {
		console.error(`[REDIS] File ${name} not found in database`)
		await prisma.job.update({
			where: {
				name: job.name,
			},
			data: {
				finished: false,
				result: 'Bestand niet gevonden in database',
			},
		})
		return
	}

	console.log(`[ImageProcessing] Compressing image ${name} with ratio ${ratio}`)

	// load image
	const data = await getFileData(name)

	// Now compress the image using sharp
	// Create a ${filename}-normal.extension with a resolution of 1920x1080
	// And a ${filename}-thumbnail.extension with a resolution of 640x360

	try {
		const metadata = await sharp(data).metadata()
		const height = metadata.height ?? 1080
		const width = metadata.width ?? 1920

		let newFilename = `${filename}-normal.jpg`
		// If resolution is below 1920x1080, don't upscale
		let resizeOptions = {}

		if (height >= 1080 && width >= 1920) {
			resizeOptions = {
				width: 1920,
			}
		} else if (height > width) {
			resizeOptions = {
				height: 1920,
			}
		}

		const pipeline = sharp(data).jpeg({ quality: ratio ?? 90 })

		let saveBuffer = await pipeline
			.clone()
			.resize({
				...resizeOptions,
				withoutEnlargement: true,
				fit: sharp.fit.cover,
			})
			.toBuffer()

		await saveNewImage(saveBuffer, newFilename, originalFile)

		newFilename = `${filename}-thumbnail.jpg`

		if (height > width) {
			resizeOptions = {
				height: 640,
			}
		} else {
			resizeOptions = {
				width: 640,
			}
		}

		saveBuffer = await pipeline
			.clone()
			.resize({
				...resizeOptions,
				fit: sharp.fit.cover,
				withoutEnlargement: true,
			})
			.toBuffer()

		await saveNewImage(saveBuffer, newFilename, originalFile)

		await prisma.job.update({
			where: {
				name: job.name,
			},
			data: {
				finished: true,
				completedAt: new Date(),
				result: 'Bestand gecomprimeerd',
			},
		})
	} catch (err) {
		console.error('[ImageProcessing] Error compressing image', err)
		await prisma.job.update({
			where: {
				name: job.name,
			},
			data: {
				finished: false,
				completedAt: new Date(),
				result: (err as Error).message,
			},
		})
	}
}

function rotateImage(msg: ImageProcessingJob) {
	console.log('TODO')
}

async function saveNewImage(data: Buffer, newFilename: string, file: File) {
	// Upload to GridFS
	const id = await uploadFile(data, newFilename)

	// Create in DB
	await prisma.file.create({
		data: {
			id: id.toString(),
			filename: newFilename,
			uploaderId: file.uploaderId,
		},
	})

	return id
}

export const ImageProcessing = {
	compressImage,
	rotateImage,
}
