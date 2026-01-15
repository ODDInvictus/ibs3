import { createRedisJob } from '$lib/server/cache'
import type { RequestEvent, RequestHandler } from './$types'

export const POST: RequestHandler = async ({ fetch, request }: RequestEvent) => {
	const body = await request.json()
	const param = body.parameter ?? 'none'

	await createRedisJob('email-test', body.alias + ',' + param)

	return new Response()
}
