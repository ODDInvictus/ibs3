import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400);

	const invoice = await db.saleInvoice.findUnique({
		where: { id },
		include: {
			rows: true,
			to: true,
			treasurer: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	if (!invoice) throw error(404);
	if (!invoice.date) throw redirect(300, `/financieel/sales/create?id=${id}`);

	return {
		invoice: JSON.parse(JSON.stringify(invoice))
	};
}) satisfies PageServerLoad;
