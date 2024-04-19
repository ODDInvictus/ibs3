import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async () => {
	const photoTags = await db.photoTag.findMany({
		orderBy: {
			name: 'asc',
		},
		select: {
			id: true,
			name: true,
			_count: {
				select: {
					photos: true,
				},
			},
		},
	})

	return { photoTags }
}) satisfies PageServerLoad
