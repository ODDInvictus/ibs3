import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { createInvoiceForm } from './createInvoiceForm'
import db from '$lib/server/db'

export const load = (async ({ url }) => {
	// If the url contains an id, we are editing an invoice
	const invoiceId = Number(url.searchParams.get('id'))

	if (invoiceId) {
		const invoice = await db.journal.findUnique({
			where: { id: invoiceId },
			include: {
				Rows: true,
			},
		})
		if (!invoice) return error(404)
		if (invoice.date) return redirect(300, `/ongeveer/sales/${invoice.id}`)

		await createInvoiceForm.transform({
			values: {
				id: invoice.id.toString(),
				toId: invoice.relationId.toString(),
				termsOfPayment: invoice.termsOfPayment,
				reference: invoice.ref ?? '',
				description: invoice.description ?? '',
				tav: invoice.tav ?? '',
				rows: invoice.Rows.map(row => ({
					amount: row.amount,
					price: Number(row.price),
					description: row.description,
					ledgerId: row.ledgerId.toString(),
					productId: row.productId?.toString(),
				})),
			},
		})
	} else {
		await createInvoiceForm.transform()
	}

	return {
		form: createInvoiceForm.attributes,
	}
}) satisfies PageServerLoad

export const actions = createInvoiceForm.actions
