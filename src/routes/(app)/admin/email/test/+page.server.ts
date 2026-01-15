import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { selectRandomItemFromArray } from '$lib/utils'

export const load = (async () => {
	const activities = await db.activity.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: [
			{
				startTime: 'desc',
			},
		],
	})

	const users = await db.user.findMany({
		where: {
			isActive: true,
		},
		select: {
			ldapId: true,
			firstName: true,
		},
	})

	return {
		aliases: {
			activities,
			users,
		},
	}
}) satisfies PageServerLoad
