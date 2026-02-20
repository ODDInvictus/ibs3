import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	log('Healthcheck performed')
	return new Response('ok')
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Health][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}
