import { isAdmin } from '$lib/server/auth'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { settings } from '$lib/server/settings'

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!isAdmin(locals.user)) {
		throw error(403, 'Helaas is deze pagina alleen voor admins')
	}

	// Get the settings from the request body
	const setting = await request.json()

	// Update the settings in the database
	const id = setting.id
	const value = setting.value

	if (!id) {
		throw error(400, 'ID mist')
	}

	await settings.update(id, value)

	return new Response('ok')
}
