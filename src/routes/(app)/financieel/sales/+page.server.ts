import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		invoices: JSON.parse(
			JSON.stringify(
				await db.$queryRaw`
      SELECT i.*, SUM(r.amount * r.price) AS total, p.name AS relation, p.id AS relationId
      FROM SaleInvoice AS i, SaleInvoiceRow AS r, FinancialPerson as p
      WHERE r.saleInvoiceId = i.id
      AND i.toId = p.id
      GROUP BY i.id
    `
			)
		)
	};
}) satisfies PageServerLoad;
