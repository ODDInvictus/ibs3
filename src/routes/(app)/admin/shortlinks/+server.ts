import { isAdmin } from '$lib/server/auth'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!isAdmin(locals.user)) {
		return error(403, 'Helaas heb jij geen rechten voor deze actie')
	}
	const body = await request.json()

	if (!body.action || !body.id) {
		return error(400, 'ID of actie mist')
	}

	switch (body.action) {
		case 'delete':
			// delete link
			await db.link.delete({
				where: {
					id: body.id,
				},
			})
			return new Response(JSON.stringify({ message: 'Link verwijderd' }))
		case 'edit':
			// edit link
			return new Response(JSON.stringify({ message: 'Link aangepast' }))
		default:
			return new Response(JSON.stringify({ message: 'Actie niet gevonden' }), { status: 404 })
	}

	return new Response('Iets is fout gegaan', { status: 500 })
}
