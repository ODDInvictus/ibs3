import { Form, type Field } from '$lib/form/form-generator';
import { Roles } from '$lib/constants';
import db from '$lib/server/db';
import type { SaleInvoiceRow } from '@prisma/client';

type row = {
	amount: number;
	price: number;
	description: string;
	ledgerId: string;
	productId?: string;
};

const createInvoiceRows = async (rows: row[], invoiceId: number) => {
	const rowInsertions: Promise<SaleInvoiceRow>[] = [];
	rows.forEach((row) => {
		const productId = row.productId ? Number(row.productId) : undefined;
		rowInsertions.push(
			db.saleInvoiceRow.create({
				data: {
					amount: row.amount,
					price: row.price,
					description: row.description,
					ledgerId: Number(row.ledgerId),
					productId,
					saleInvoiceId: invoiceId
				}
			})
		);
	});

	await Promise.all(rowInsertions);
};

export const createInvoiceForm = new Form<{
	termsOfPayment: number;
	toId: string;
	description?: string;
	tav?: string;
	reference?: string;
	id?: string;
	rows: row[];
}>({
	title: 'Factuur maken',
	logic: async (data) => {
		// id is an hidden input that is set when editing an invoice
		const id = Number(data.id);
		try {
			if (Number.isNaN(id)) {
				const invoice = await db.saleInvoice.create({
					data: {
						termsOfPayment: data.termsOfPayment,
						toId: Number(data.toId),
						ref: data.reference,
						treasurerId: data.user.id,
						description: data.description,
						tav: data.tav
					}
				});

				await createInvoiceRows(data.rows, invoice.id);

				return {
					success: true,
					message: 'Factuur aangemaakt, je wordt nu doorgestuurd.',
					status: 201,
					redirectTo: '/financieel/sales'
				};
			} else {
				await db.saleInvoice.update({
					where: { id },
					data: {
						termsOfPayment: data.termsOfPayment,
						toId: Number(data.toId),
						ref: data.reference,
						treasurerId: data.user.id,
						description: data.description,
						tav: data.tav
					}
				});

				await db.saleInvoiceRow.deleteMany({
					where: { saleInvoiceId: id }
				});

				await createInvoiceRows(data.rows, id);

				return {
					success: true,
					message: 'Factuur opgeslagen',
					status: 200,
					redirectTo: `/financieel/sales`
				};
			}
		} catch (e: any) {
			console.error(e);
			return {
				success: false,
				status: 500,
				errors: [{ message: 'Er is iets misgegaan bij het aanmaken van de factuur' }]
			};
		}
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	fields: [
		{
			label: 'Referentie',
			name: 'reference',
			type: 'text'
		} as Field<'text'>,
		{
			label: 'Omschrijving',
			name: 'description',
			type: 'text'
		} as Field<'text'>,
		{
			label: 'Betalingstermijn',
			name: 'termsOfPayment',
			type: 'number'
		} as Field<'number'>,
		{
			name: 'toId',
			type: 'select',
			label: 'Klant',
			getOptions: async () => {
				const relations = await db.financialPerson.findMany({
					where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true }
				});

				return relations.map((relation) => ({
					label: `${relation.id} - ${relation.name}`,
					value: relation.id
				}));
			}
		} as Field<'select'>,
		{
			name: 'tav',
			type: 'text',
			label: 'T.a.v.'
		} as Field<'text'>,
		{
			name: 'id',
			type: 'hidden'
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
					minValue: 0
				} as Field<'number'>,
				{
					name: 'price',
					type: 'number',
					label: 'Prijs',
					step: 0.01,
					minValue: 0
				} as Field<'number'>,
				{
					name: 'description',
					type: 'text',
					label: 'Omschrijving'
				} as Field<'text'>,
				{
					name: 'ledgerId',
					type: 'select',
					label: 'Grootboek',
					getOptions: async () => {
						const ledgers = await db.ledger.findMany({
							where: { isActive: true }
						});

						return ledgers.map((ledger) => ({
							label: `${ledger.id} - ${ledger.name}`,
							value: ledger.id
						}));
					}
				} as Field<'select'>,
				{
					name: 'productId',
					type: 'select',
					label: 'Product',
					optional: true,
					getOptions: async () => {
						const products = await db.product.findMany({
							where: { isActive: true }
						});

						return products.map((product) => ({
							label: `${product.id} - ${product.name}`,
							value: product.id
						}));
					}
				} as Field<'select'>
			]
		} as Field<'table'>
	],
	formId: 'create-invoice-form',
	submitStr: 'Opslaan'
});
