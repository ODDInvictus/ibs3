import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		invoices: JSON.parse(
			JSON.stringify(
				await db.$queryRaw`
      SELECT i.*, SUM(r.amount * r.price) AS total, p.name AS relation, p.id AS relationId
      FROM Invoice AS i, InvoiceRow AS r, FinancialPerson as p
      WHERE i.type = 'SALE'
      AND r.invoiceId = i.id
      AND i.relationId = p.id
      GROUP BY i.id
    `
			)
		)
	};
}) satisfies PageServerLoad;
