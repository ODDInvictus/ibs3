import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async () => {
	const activities = await db.activity.findMany({
		select: {
			id: true,
			name: true,
			startTime: true,
			_count: {
				select: {
					photos: true,
				},
			},
		},
		orderBy: {
			startTime: 'desc',
		},
	})

	return { activities }
}) satisfies PageServerLoad
