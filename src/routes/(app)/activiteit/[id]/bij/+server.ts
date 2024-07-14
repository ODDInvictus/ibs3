import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ locals, params }) => {
	const aid = Number(params.id)
	const user = locals.user

	const activity = await db.activity.findUnique({
		where: {
			id: aid,
		},
		select: {
			endTime: true,
		},
	})

	if (!activity) {
		return error(404, 'Activiteit niet gevonden')
	}

	if (activity.endTime < new Date()) {
		return error(400, 'Activiteit is al geweest, je kan je status niet meer aanpassen')
	}

	await db.attending.updateMany({
		where: {
			userId: user.id,
			activityId: aid,
		},
		data: {
			status: 'ATTENDING',
		},
	})

	return new Response()
}
