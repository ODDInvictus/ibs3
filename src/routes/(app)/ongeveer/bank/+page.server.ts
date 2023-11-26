import db from '$lib/server/db';
import Decimal from 'decimal.js';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const bankTransactions = await db.bankTransaction.findMany({
		orderBy: {
			completedDate: 'desc'
		},
		select: {
			completedDate: true,
			description: true,
			amount: true,
			id: true,
			ref: true,
			Transaction: {
				select: {
					TransactionMatchRow: true
				}
			}
		}
	});

	enum statuses {
		UNMATCHED = 'UNMATCHED',
		MATCHED = 'MATCHED',
		PARTIAL = 'PARTIAL'
	}

	const serialized = bankTransactions.map((t) => {
		const matchSum = t.Transaction.TransactionMatchRow.reduce(
			(acc, r) => acc.add(r.amount),
			new Decimal(0)
		).abs();
		const amount = t.amount.abs();
		const status = matchSum.eq(0)
			? statuses.UNMATCHED
			: amount.eq(matchSum)
			? statuses.MATCHED
			: statuses.PARTIAL;
		return {
			completedDate: t.completedDate,
			description: t.description,
			id: t.id,
			ref: t.ref,
			amount: t.amount.toNumber(),
			status
		};
	});

	return {
		bankTransactions: serialized
	};
}) satisfies PageServerLoad;
