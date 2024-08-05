import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async () => {
	// Select all active leaderboards
	// So only if currentDate > closesAt
	const currentDate = new Date()

	const leaderboards = await db.leaderboard.findMany({
		where: {
			OR: [
				{
					closesAt: {
						gt: currentDate,
					},
				},
				{
					closesAt: null,
				},
			],
		},
		orderBy: {
			pinned: 'desc',
		},
	})

	return { leaderboards }
}) satisfies PageServerLoad
