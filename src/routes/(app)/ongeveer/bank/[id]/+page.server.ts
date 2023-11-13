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
			BankTransactionMatchRow: {
				include: {
					Journal: {
						select: {
							ref: true
						}
					},
					Ledger: {
						select: {
							name: true
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
			rows: bankTransaction.BankTransactionMatchRow.map((row) => ({
				description: row.description ?? '',
				amount: row.amount.toNumber(),
				// TODO: journal?
				invoice: row.journalId?.toString() ?? '',
				saldo: !!row.transactionId,
				ledger: row.ledgerId?.toString() ?? ''
			}))
		}
	});

	return {
		bankTransaction: JSON.parse(JSON.stringify(bankTransaction)) as typeof bankTransaction,
		form: matchForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = matchForm.actions;
