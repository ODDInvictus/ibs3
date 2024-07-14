import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const DELETE: RequestHandler = async ({ request }) => {
	const { user }: { user: number } = await request.json()

	const strafbak = await db.strafbak.findFirst({
		where: {
			receiverId: user,
			dateDeleted: null,
		},
		orderBy: {
			dateCreated: 'asc',
		},
	})

	if (!strafbak)
		return json(
			{
				message: `User ${user} heeft geen strafbakken`,
			},
			{
				status: 400,
			},
		)

	await db.strafbak.update({
		where: {
			id: strafbak.id,
		},
		data: {
			dateDeleted: new Date(),
		},
	})

	return new Response('', {
		status: 200,
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
