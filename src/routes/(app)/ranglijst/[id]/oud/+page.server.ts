import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load = (async ({ params }) => {
	const leaderboard = await db.leaderboard.findUnique({
		where: {
			id: params.id,
		},
	})

	if (!leaderboard) {
		return error(404, 'Deze ranglijst bestaat niet jonge dikke boktor.')
	}

	const entries = await db.leaderboardEntry.findMany({
		where: {
			leaderboardId: params.id,
		},
		include: {
			user: {
				select: {
					firstName: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	if (entries.length === 0) {
		return error(404, 'Deze ranglijst heeft nog geen inzendingen.')
	}

	return { leaderboard, entries, title: leaderboard.name }
}) satisfies PageServerLoad
