import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import Decimal from 'decimal.js';

export const getJournal = async (id: number) => {
	if (Number.isNaN(id)) throw error(400);

	const journal = await db.journal.findUnique({
		where: { id },
		include: {
			Rows: {
				include: {
					Product: true,
					Ledger: true
				}
			},
			TransactionMatchRow: true,
			relation: {
				include: {
					FinancialPersonDataOther: true,
					FinancialPersonDataUser: {
						include: {
							user: true
						}
					}
				}
			},
			Treasurer: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	if (!journal) throw error(404);

	const total = journal.Rows.reduce(
		(acc, row) => acc.add(row.price.mul(row.amount)),
		new Decimal(0)
	);
	const paid = journal.TransactionMatchRow.reduce(
		(acc, row) => acc.add(row.amount),
		new Decimal(0)
	);
	const toPay = total.sub(paid).toNumber();

	journal.Rows.map((r) => ((r.price as unknown as number) = r.price.toNumber()));
	return { journal, total: total.toNumber(), paid: paid.toNumber(), toPay };
};
