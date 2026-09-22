import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const tokens = await db.accessToken.findMany({
		select: {
			user: {
				select: {
					ldapId: true,
				},
			},
			name: true,
			type: true,
			lastUsed: true,
		},
		orderBy: {
			lastUsed: 'desc',
		},
	})

	return { tokens }
}) satisfies PageServerLoad
