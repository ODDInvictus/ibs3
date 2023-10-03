import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createInvoiceForm } from './createInvoiceForm';
import db from '$lib/server/db';

export const load = (async ({ url }) => {
	const invoiceId = Number(url.searchParams.get('id'));
	if (isNaN(invoiceId)) throw error(400);

	const invoice = await db.saleInvoice.findUnique({
		where: { id: invoiceId },
		include: {
			rows: true
		}
	});

	if (!invoice) throw error(404);
	if (invoice.date) throw redirect(300, `/financieel/sales/${invoice.id}`);

	await createInvoiceForm.transform({
		values: {
			id: invoice.id.toString(),
			toId: invoice.toId.toString(),
			termsOfPayment: invoice.termsOfPayment,
			reference: invoice.ref ?? '',
			rows: invoice.rows.map((row) => ({
				amount: row.amount,
				price: Number(row.price),
				description: row.description,
				ledgerId: row.ledgerId.toString(),
				productId: row.productId?.toString()
			}))
		}
	});

	return {
		form: createInvoiceForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = createInvoiceForm.actions;
