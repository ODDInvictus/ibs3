import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { json } from '@sveltejs/kit'
import { Setting, settings } from '$lib/server/settings'

export const DELETE: RequestHandler = async ({ request }) => {
	const { user }: { user: number } = await request.json()

	try {
		deleteStrafbak(user)
	} catch (error) {
		return json(
			{
				message: error,
			},
			{
				status: 400,
			},
		)
	}

	// try to delete for the drinking buddy
	const buddies = settings.getBool(Setting.STRAFBAKKEN_DRINKING_BUDDIES, true)

	if (buddies && (user === 10 || user === 15)) {
		try {
			deleteStrafbak(user === 10 ? 15 : 10)
		} catch (err) {
			// do not care
		}
	}

	return new Response('', {
		status: 200,
	})
}

async function deleteStrafbak(uid: number) {
	const strafbak = await db.strafbak.findFirst({
		where: {
			receiverId: uid,
			dateDeleted: null,
		},
		orderBy: {
			dateCreated: 'asc',
		},
	})

	if (!strafbak) {
		throw new Error(`User ${uid} heeft geen strafbakken`)
	}

	await db.strafbak.update({
		where: {
			id: strafbak.id,
		},
		data: {
			dateDeleted: new Date(),
		},
	})
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json()
	const uid = locals.user.id

	switch (body.action) {
		case 'self':
			if (!body.reason) {
				return new Response('Geen reden opgegeven', { status: 400 })
			}

			const strafbak = await db.strafbak.create({
				data: {
					receiverId: uid,
					giverId: uid,
					reason: body.reason,
				},
			})

			return new Response('Gefeliciteerd', { status: 200 })
		default:
			return new Response(`Onbekende actie ${body.action} voor deze route`, { status: 400 })
	}
}
