import { getFileByFilename } from '$lib/server/files'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const file = await getFileByFilename(params.filename)

	if (!file) return new Response(null, { status: 404 })

	return new Response(file.stream as unknown as ReadableStream, {
		headers: {
			'Content-Type': file.doc.metadata?.type ?? '',
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Length': file.doc.length.toString(),
		},
	})
}
