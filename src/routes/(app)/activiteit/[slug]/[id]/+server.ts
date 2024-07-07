import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import type { AttendingStatus } from '@prisma/client'
import { error } from '@sveltejs/kit'

type RequestType = {
	status: AttendingStatus
	activityId: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { status, activityId }: RequestType = await request.json()
	const user = locals.user

	const activity = await db.activity.findUnique({
		where: {
			id: activityId,
		},
		select: {
			endTime: true,
		},
	})

	if (!activity) {
		return error(404, 'Activiteit niet gevonden')
	}

	if (activity.endTime < new Date()) {
		return error(400, 'Deze activiteit is al geweest, je kan je status niet meer aanpassen')
	}

	await db.attending.updateMany({
		where: {
			userId: user.id,
			activityId,
		},
		data: {
			status,
		},
	})

	return new Response('', {
		status: 200,
	})
}
