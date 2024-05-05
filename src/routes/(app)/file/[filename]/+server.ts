import { getFile } from '$lib/server/files'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const fileId = params.filename

	const file = await getFile(Number.parseInt(fileId))

	if (!file) return new Response(null, { status: 404 })

	return new Response(file.stream as unknown as ReadableStream, {
		headers: {
			'Content-Type': file.doc.metadata?.type ?? '',
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Length': file.doc.length.toString(),
		},
	})

	// const filename = decodeURIComponent(params.filename)
	// const gfs = new GridFSBucket(mongo, { bucketName: 'fs' })
	// const cursor = gfs.find({ filename })
	// const doc = await cursor.next()
	// if (!doc) return new Response(null, { status: 404 })

	// try {
	// 	// TODO - fix this type issue
	// 	const stream = gfs.openDownloadStreamByName(filename) as unknown as ReadableStream
	// 	return new Response(stream, {
	// 		headers: {
	// 			'Content-Type': doc.metadata?.type ?? '',
	// 			'Cache-Control': 'public, max-age=31536000, immutable',
	// 			'Content-Length': doc.length.toString(),
	// 		},
	// 	})
	// } catch (error: any) {
	// 	if (error?.code === 'ENOENT' || error === 'ENOENT') {
	// 		return new Response(null, { status: 404 })
	// 	}
	// 	console.error(error)
	// 	return new Response(null, { status: 500 })
	// }
}
