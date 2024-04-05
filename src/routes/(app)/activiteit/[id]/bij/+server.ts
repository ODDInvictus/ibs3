import type { RequestHandler } from './$types'
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ locals, params }) => {
	const aid = Number(params.id)
	const user = locals.user

	if (!user) {
		return new Response('', { status: 401 })
	}

	if (isNaN(aid)) {
		return new Response('Activiteit niet gevonden', { status: 400 })
	}

	await db.attending.updateMany({
		where: {
			userId: user.id,
			activityId: aid,
		},
		data: {
			isAttending: true,
		},
	})

	return new Response()
}
