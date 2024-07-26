import { isFeut } from '$lib/server/auth/helpers'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	// feuten check

	if (isFeut(locals.user)) {
		return error(403, 'Feuten mogen deze pagina helaas niet bekijken')
	}

	const activities = await db.activity.findMany({
		orderBy: {
			startTime: 'desc',
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			organisedBy: {
				select: {
					name: true,
				},
			},
		},
	})
	return { activities }
}) satisfies PageServerLoad
