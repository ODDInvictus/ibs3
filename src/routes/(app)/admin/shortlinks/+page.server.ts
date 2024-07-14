import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const links = await db.link.findMany({
		include: {
			user: {
				select: {
					firstName: true,
				},
			},
		},
	})

	return { links }
}) satisfies PageServerLoad
