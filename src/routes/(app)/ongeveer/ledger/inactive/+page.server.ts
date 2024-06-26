import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		ledgers: await db.ledger.findMany({
			orderBy: {
				id: 'asc',
			},
			where: {
				isActive: false,
			},
		}),
	}
}) satisfies PageServerLoad
