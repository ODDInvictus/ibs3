import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { pagination } from '$lib/utils'
import Decimal from 'decimal.js'
import { getInvictusId } from '$lib/ongeveer/db'

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
			Transaction: {
				include: {
					TransactionMatchRow: true,
				},
			},
			to: true,
			from: true,
		},
	})

	const invictusId = await getInvictusId()

	const transactionsWithStatus = transactions.map(transaction => {
		const totalMatched = transaction.Transaction.TransactionMatchRow.reduce((acc, row) => acc.add(row.amount), new Decimal(0))

		let status: 'MATCHED' | 'UNMATCHED' | 'PARTIAL'
		if (transaction.toId === invictusId || transaction.fromId === invictusId) {
			status = 'MATCHED'
		} else if (totalMatched.eq(transaction.price)) {
			status = 'MATCHED'
		} else if (totalMatched.eq(0)) {
			status = 'UNMATCHED'
		} else {
			status = 'PARTIAL'
		}

		return {
			...transaction,
			status,
		}
	})

	return {
		transactions: JSON.parse(JSON.stringify(transactionsWithStatus)) as typeof transactionsWithStatus,
		p,
		size,
	}
}) satisfies PageServerLoad
