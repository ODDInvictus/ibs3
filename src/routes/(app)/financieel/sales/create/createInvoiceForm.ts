import { Form, type Field } from '$lib/form/form-generator';
import { Roles } from '$lib/constants';
import db from '$lib/server/db';

export const createInvoiceForm = new Form<{
	date: Date;
	termsOfPayment: number;
	toId: number;
	reference?: string;
	isNotSend: boolean;
	rows: {
		amount: number;
		price: number;
		description: string;
		ledgerId: number;
		productId?: number;
	}[];
}>({
	title: 'Factuur maken',
	logic: async (data) => {
		try {
			console.log(data);
			return {
				success: true,
				message: 'Factuur aangemaakt, je wordt nu doorgestuurd.',
				status: 201,
				redirectTo: '/financieel/ledger'
			};
		} catch (e: any) {
			return {
				success: false,
				status: 500,
				errors: [{ message: 'Er is iets misgegaan bij het aanmaken van de factuur' }]
			};
		}
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	needsConfirmation: true,
	fields: [
		{
			label: 'Referentie',
			name: 'reference',
			type: 'text'
		} as Field<'text'>,
		{
			label: 'Factuurdatum',
			name: 'date',
			type: 'date',
			value: new Date()
		} as Field<'date'>,
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
					where: { type: 'OTHER', isActive: true }
				});

				return relations.map((relation) => ({
					label: `${relation.id} - ${relation.name}`,
					value: relation.id
				}));
			}
		} as Field<'select'>,
		{
			name: 'isNotSend',
			type: 'checkbox',
			label: 'Draft',
			value: true,
			description: 'Een factuur kan niet meer worden gewijzigd als deze geen draft meer is.'
		} as Field<'checkbox'>,
		{
			type: 'table',
			name: 'rows',
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
	submitStr: 'Aanmaken'
});
