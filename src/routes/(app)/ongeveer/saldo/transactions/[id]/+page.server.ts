import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getInvictusId } from '$lib/ongeveer/db'
import Decimal from 'decimal.js'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) error(404, 'Transactie niet gevonden')

	const transaction = await db.saldoTransaction.findUnique({
		where: { id },
		include: {
			Transaction: {
				include: {
					TransactionMatchRow: true,
				},
			},
			from: true,
			to: true,
			TransactionMatchRow: true,
		},
	})

	if (!transaction) error(404)

	const invictusId = await getInvictusId()
	const shouldMatch = transaction.fromId === invictusId || transaction.toId === invictusId

	const totalMatched = transaction.Transaction.TransactionMatchRow.reduce((acc, row) => acc.add(row.amount), new Decimal(0)).add(
		transaction.TransactionMatchRow?.amount ?? 0,
	)

	const status = totalMatched.eq(transaction.price) ? 'done' : totalMatched.eq(0) ? 'open' : 'partial'

	return {
		transaction: JSON.parse(JSON.stringify(transaction)) as typeof transaction,
		shouldMatch,
		totalMatched: totalMatched.toNumber(),
		status,
	}
}) satisfies PageServerLoad
