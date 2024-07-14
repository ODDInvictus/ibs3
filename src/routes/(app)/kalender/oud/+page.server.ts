import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const activities = await db.activity.findMany({
		orderBy: {
			id: 'desc',
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
