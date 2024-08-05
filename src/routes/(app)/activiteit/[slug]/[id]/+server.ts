import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import type { AttendingStatus } from '@prisma/client'
import { error } from '@sveltejs/kit'
import { isSenaat } from '$lib/server/auth/helpers'

type RequestType = {
	status: AttendingStatus
	activityId: number
	ldapId: string
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { status, activityId, ldapId }: RequestType = await request.json()

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

	const isUser = locals.user.ldapId === ldapId

	if (!isUser && !isSenaat(locals.user)) {
		return error(403, 'Je hebt geen toestemming om deze actie uit te voeren')
	}

	await db.attending.updateMany({
		where: {
			user: {
				ldapId,
			},
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
