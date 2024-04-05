import { Form, type Field } from '$lib/form/form-generator'
import { Roles } from '$lib/constants'
import db from '$lib/server/db'
import type { JournalRow } from '@prisma/client'

type row = {
	amount: number
	price: number
	description: string
	ledgerId: string
	productId?: string
}

/**
 * Creates sale invoice rows in the database.
 * @param rows - An array of row objects containing information about the sale invoice rows.
 * @param invoiceId - The ID of the sale invoice to which the rows belong.
 * @returns A Promise that resolves when all the sale invoice rows have been created in the database.
 */
const createInvoiceRows = async (rows: row[], invoiceId: number) => {
	const rowInsertions: Promise<JournalRow>[] = []
	rows.forEach(row => {
		const productId = row.productId ? Number(row.productId) : undefined
		rowInsertions.push(
			db.journalRow.create({
				data: {
					amount: row.amount,
					price: row.price,
					description: row.description,
					ledgerId: Number(row.ledgerId),
					productId,
					journalId: invoiceId,
				},
			}),
		)
	})

	await Promise.all(rowInsertions)
}

export const createInvoiceForm = new Form<{
	termsOfPayment: number
	toId: string
	description?: string
	tav?: string
	reference?: string
	id?: string
	rows: row[]
}>({
	title: 'Factuur maken',
	logic: async data => {
		// id is an hidden input that is set when editing an invoice
		const id = Number(data.id)
		try {
			if (Number.isNaN(id)) {
				const invoice = await db.journal.create({
					data: {
						termsOfPayment: data.termsOfPayment,
						relationId: Number(data.toId),
						ref: data.reference,
						treasurerId: data.user.id,
						description: data.description,
						tav: data.tav,
						type: 'SALE',
					},
				})

				await createInvoiceRows(data.rows, invoice.id)

				return {
					success: true,
					message: 'Factuur aangemaakt, je wordt nu doorgestuurd.',
					status: 201,
					redirectTo: '/ongeveer/sales',
				}
			} else {
				await db.journal.update({
					where: { id },
					data: {
						termsOfPayment: data.termsOfPayment,
						relationId: Number(data.toId),
						ref: data.reference,
						treasurerId: data.user.id,
						description: data.description,
						tav: data.tav,
					},
				})

				await db.journalRow.deleteMany({
					where: { journalId: id },
				})

				await createInvoiceRows(data.rows, id)

				return {
					success: true,
					message: 'Factuur opgeslagen',
					status: 200,
					redirectTo: `/ongeveer/sales`,
				}
			}
		} catch (e: any) {
			console.error(e)
			return {
				success: false,
				status: 500,
				errors: [{ message: 'Er is iets misgegaan bij het aanmaken van de factuur' }],
			}
		}
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	fields: [
		{
			label: 'Referentie',
			name: 'reference',
			type: 'text',
			optional: true,
		} as Field<'text'>,
		{
			label: 'Omschrijving',
			name: 'description',
			type: 'text',
			optional: true,
		} as Field<'text'>,
		{
			label: 'Betalingstermijn',
			name: 'termsOfPayment',
			type: 'number',
		} as Field<'number'>,
		{
			name: 'toId',
			type: 'select',
			label: 'Relatie',
			getOptions: async () => {
				const relations = await db.financialPerson.findMany({
					where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true },
				})

				return relations.map(relation => ({
					label: `${relation.id} - ${relation.name}`,
					value: relation.id,
				}))
			},
		} as Field<'select'>,
		{
			name: 'tav',
			type: 'text',
			label: 'T.a.v.',
			optional: true,
		} as Field<'text'>,
		{
			name: 'id',
			type: 'hidden',
		} as Field<'hidden'>,
		{
			type: 'table',
			name: 'rows',
			label: 'Factuurregels',
			columns: [
				{
					name: 'amount',
					type: 'number',
					label: 'Aantal',
					step: 1,
					minValue: 0,
				} as Field<'number'>,
				{
					name: 'price',
					type: 'number',
					label: 'Prijs',
					step: 0.01,
					minValue: 0,
				} as Field<'number'>,
				{
					name: 'description',
					type: 'text',
					label: 'Omschrijving',
				} as Field<'text'>,
				{
					name: 'ledgerId',
					type: 'select',
					label: 'Grootboek',
					getOptions: async () => {
						const ledgers = await db.ledger.findMany({
							where: { isActive: true },
						})

						return ledgers.map(ledger => ({
							label: `${ledger.id} - ${ledger.name}`,
							value: ledger.id,
						}))
					},
				} as Field<'select'>,
				{
					name: 'productId',
					type: 'select',
					label: 'Product',
					optional: true,
					getOptions: async () => {
						const products = await db.product.findMany({
							where: { isActive: true },
						})

						return products.map(product => ({
							label: `${product.id} - ${product.name}`,
							value: product.id,
						}))
					},
				} as Field<'select'>,
			],
		} as Field<'table'>,
	],
	formId: 'create-invoice-form',
	submitStr: 'Opslaan',
})
