import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';
import { Roles } from '$lib/constants';

export const editForm = new Form<{
	id: number;
	name: string;
	description: string;
	prevId: number;
}>({
	title: 'Grooteboekrekening aanpassen',
	logic: async (data) => {
		try {
			await db.ledger.update({
				where: {
					id: Number(data.prevId)
				},
				data: {
					id: data.id,
					name: data.name,
					description: data.description
				}
			});

			return {
				success: true,
				message: 'De grootboekrekening is aangepast, je wordt doorgestuurd',
				status: 200,
				redirectTo: `/financieel/ledger/${data.id}`
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
		} as Field<'textarea'>,
		{
			name: 'prevId',
			type: 'hidden'
		} as Field<'hidden'>
	],
	formId: 'edit-ledger-form',
	submitStr: 'Opslaan'
});
