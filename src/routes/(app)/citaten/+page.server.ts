import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const quotes = await db.quote.findMany({
		select: {
			id: true,
			text: true,
			createdAt: true,
			msg: {
				select: {
					sender: true,
				},
			},
			quotee: {
				select: {
					firstName: true,
				},
			},
			quoter: {
				select: {
					firstName: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	return { quotes }
}) satisfies PageServerLoad
