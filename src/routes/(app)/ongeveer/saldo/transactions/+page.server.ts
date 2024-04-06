import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { pagination } from '$lib/utils'

export const load = (async ({ url }) => {
	const { p, size } = pagination(url)

	const transactions = await db.saldoTransaction.findMany({
		take: size,
		skip: p * size,
		orderBy: {
			Transaction: {
				createdAt: 'desc',
			},
		},
		include: {
			Transaction: true,
			to: true,
			from: true,
		},
	})

	return {
		transactions: JSON.parse(JSON.stringify(transactions)) as typeof transactions,
		p,
		size,
	}
}) satisfies PageServerLoad
