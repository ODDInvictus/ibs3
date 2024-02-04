import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const getJournal = async (id: number) => {
	if (isNaN(id)) throw error(400);

	const journal = await db.journal.findUnique({
		where: { id },
		include: {
			Rows: true,
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
	if (!journal.date) throw redirect(300, `/ongeveer/sales/create?id=${id}`);

	journal.Rows.map((r) => ((r.price as unknown as number) = r.price.toNumber()));
	return journal;
};
