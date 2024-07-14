import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const jobs = await db.job.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	})

	return { jobs }
}) satisfies PageServerLoad
