import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { pagination } from '$lib/utils'
import Decimal from 'decimal.js'

export const load = (async ({ params, url }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(404, 'Not found')

	const { p, size } = pagination(url)

	const ledger = await db.ledger.findUnique({
		where: { id },
		include: {
			JournalRows: {
				orderBy: {
					Journal: {
						date: 'desc',
					},
				},
				include: {
					Journal: true,
				},
			},
		},
	})

	if (!ledger) throw error(404, 'Not found')

	// Get the balance of the ledger
	const balance = ledger.JournalRows.reduce((acc, { price, amount, Journal }) => {
		if (Journal.type === 'SALE') return acc.add(price.mul(amount))
		return acc.sub(price.mul(amount))
	}, new Decimal(0)).toNumber()

	// Pagination
	ledger.JournalRows = ledger.JournalRows.slice(p * size, (p + 1) * size)

	return {
		ledger: JSON.parse(JSON.stringify(ledger)) as typeof ledger,
		p,
		size,
		balance,
		canDelete: ledger.JournalRows.length === 0,
	}
}) satisfies PageServerLoad
