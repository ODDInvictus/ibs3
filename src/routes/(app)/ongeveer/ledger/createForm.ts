import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';
import { Roles } from '$lib/constants';

export const createForm = new Form<{
	id: number;
	name: string;
	description: string;
}>({
	title: 'Nieuwe grootboekrekening aanmaken',
	logic: async (data) => {
		try {
			await db.ledger.create({
				data: {
					id: data.id,
					name: data.name,
					description: data.description
				}
			});

			return {
				success: true,
				message: 'Grootboekrekening aangemaakt, je wordt nu doorgestuurd.',
				status: 201,
				redirectTo: '/ongeveer/ledger'
			};
		} catch (e: any) {
			if (e.code === 'P2002') {
				return {
					success: false,
					errors: [
						{
							field: 'id',
							message: 'Deze ID is al in gebruik'
						}
					],
					status: 400
				};
			} else {
				return {
					success: false,
					status: 500,
					errors: [{ message: 'Er is iets misgegaan bij het aanmaken van de grootboekrekening' }]
				};
			}
		}
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	fields: [
		{
			label: 'ID',
			name: 'id',
			type: 'number'
		} as Field<'number'>,
		{
			label: 'Naam',
			name: 'name',
			type: 'text'
		} as Field<'text'>,
		{
			label: 'Beschrijving',
			name: 'description',
			type: 'textarea'
		} as Field<'textarea'>
	],
	formId: 'create-ledger-form',
	submitStr: 'Aanmaken'
});
