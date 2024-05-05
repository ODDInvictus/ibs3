import { isAdmin } from '$lib/server/auth'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ locals }) => {
	if (!isAdmin(locals.user)) {
		throw error(403, 'Helaas is deze pagina alleen voor admins')
	}

	const settings = await db.settings.findMany()
	return { settings }
}) satisfies PageServerLoad
