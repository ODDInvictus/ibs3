import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const leaderboards = await db.leaderboard.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	})

	return { leaderboards }
}) satisfies PageServerLoad
