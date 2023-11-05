import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const getInvoice = async (id: number) => {
	if (isNaN(id)) throw error(400);

	const invoice = await db.invoice.findUnique({
		where: { id },
		include: {
			Rows: true,
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
			Treasurer: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	if (!invoice) throw error(404);
	if (!invoice.date) throw redirect(300, `/ongeveer/sales/create?id=${id}`);

	invoice.Rows.map((r) => ((r.price as unknown as number) = r.price.toNumber()));
	return invoice;
};
