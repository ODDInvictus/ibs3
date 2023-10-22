import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const getInvoice = async (id: number) => {
	if (isNaN(id)) throw error(400);

	const invoice = await db.invoice.findUnique({
		where: { id },
		include: {
			rows: true,
			BankTransactionMatchRow: true,
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
			treasurer: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	if (!invoice) throw error(404);
	if (!invoice.date) throw redirect(300, `/ongeveer/sales/create?id=${id}`);

	invoice.rows.map((r) => ((r.price as unknown as number) = r.price.toNumber()));
	return invoice;
};
