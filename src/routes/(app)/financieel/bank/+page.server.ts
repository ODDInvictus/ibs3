import db from '$lib/server/db';
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
			SaleInvoice: true,
			id: true,
			ref: true
		}
	});

	return {
		bankTransactions: bankTransactions.map((t) => {
			// @ts-expect-error
			t.amount = t.amount.toNumber();
			return t;
		})
	};
}) satisfies PageServerLoad;
