import { db } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { verifyAnonymousToken } from '$lib/server/auth/token'

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json()

	if (!body) {
		error(400, 'Geen body meegegeven')
	}

	if (!body.token) {
		error(400, 'Geen token meegegeven')
	}

	const { valid } = await verifyAnonymousToken(body.token, 'esp-activiteit')

	if (!valid) {
		error(403, 'Token is ongeldig')
	}

	const activity = await db.activity.findFirst({
		where: {
			endTime: {
				gte: new Date(),
			},
		},
		orderBy: [
			{
				startTime: 'asc',
			},
		],
		select: {
			name: true,
			startTime: true,
			location: {
				select: {
					name: true,
				},
			},
		},
	})

	return json(activity)
}
