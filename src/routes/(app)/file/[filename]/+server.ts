import { readFileByFilename } from '$lib/server/files'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const file = await readFileByFilename(params.filename)

	if (!file) return new Response(null, { status: 404 })

	return new Response(file, {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Length': '' + file.byteLength,
		},
	})
}
