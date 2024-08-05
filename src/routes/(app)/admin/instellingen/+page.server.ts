import { isAdmin } from '$lib/server/auth'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { settings } from '$lib/server/settings/settings'

export const load = (async ({ locals }) => {
	if (!isAdmin(locals.user)) {
		throw error(403, 'Helaas is deze pagina alleen voor admins')
	}

	const ibsSettings = await db.settings.findMany()
	const unsetKeys = settings.getUnsetKeys()
	return { ibsSettings, unsetKeys }
}) satisfies PageServerLoad
