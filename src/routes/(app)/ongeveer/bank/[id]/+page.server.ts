import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { matchForm } from './matchTransaction';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400, 'Invalid id');

	const bankTransaction = await db.bankTransaction.findUnique({
		where: { id },
		include: {
			Relation: true,
			Transaction: {
				include: {
					TransactionMatchRow: {
						include: {
							Journal: true,
							SaldoTransaction: true
						}
					}
				}
			}
		}
	});
	if (!bankTransaction) throw error(404, 'Bank transaction not found');

	await matchForm.transform({
		values: {
			id: bankTransaction.id.toString(),
			relation: bankTransaction.relationId?.toString(),
			ref: bankTransaction.ref ?? '',
			rows: (bankTransaction.Transaction.TransactionMatchRow ?? []).map((row) => ({
				description: row.description ?? '',
				amount: row.amount.toNumber(),
				journal: row.journalId?.toString() ?? '',
				saldo: !!row.SaldoTransaction
			}))
		}
	});

	return {
		bankTransaction: JSON.parse(JSON.stringify(bankTransaction)) as typeof bankTransaction,
		form: matchForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = matchForm.actions;
