import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';
import { Roles } from '$lib/constants';

export const createRelationForm = new Form<{
	name: string;
	description?: string;
	iban?: string;
	address?: string;
	postalCode?: string;
	city?: string;
	email?: string;
	id?: string;
}>({
	title: 'Nieuwe relatie aanmaken',
	logic: async (data) => {
		try {
			const id = Number(data.id);

			if (Number.isNaN(id)) {
				const financialPerson = await db.financialPerson.create({
					data: {
						name: data.name,
						type: 'OTHER'
					}
				});

				await db.financialPersonDataOther.create({
					data: {
						personId: financialPerson.id,
						description: data.description,
						iban: data.iban,
						address: data.address,
						postalCode: data.postalCode,
						city: data.city,
						email: data.email
					}
				});

				return {
					success: true,
					message: 'Relatie aangemaakt, je wordt nu doorgestuurd.',
					status: 201,
					redirectTo: '/financieel/relations'
				};
			} else {
				const q1 = db.financialPerson.update({
					where: {
						id
					},
					data: {
						name: data.name
					}
				});

				const q2 = db.financialPersonDataOther.update({
					where: {
						personId: id
					},
					data: {
						description: data.description,
						iban: data.iban,
						address: data.address,
						postalCode: data.postalCode,
						city: data.city,
						email: data.email
					}
				});

				await Promise.all([q1, q2]);

				return {
					success: true,
					message: 'Realtie aangepast, je wordt nu doorgestuurd.',
					status: 201,
					redirectTo: `/financieel/relations/${id}`
				};
			}
		} catch (e: any) {
			console.error(e);
			return {
				success: false,
				status: 500,
				errors: [{ message: 'Er is iets misgegaan bij het aanmaken van de relatie' }]
			};
		}
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	fields: [
		{
			label: 'Naam',
			name: 'name',
			type: 'text'
		} as Field<'text'>,
		{
			label: 'Beschrijving',
			name: 'description',
			type: 'textarea',
			optional: true
		} as Field<'textarea'>,
		{
			label: 'IBAN',
			name: 'iban',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			label: 'Adres',
			name: 'address',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			label: 'Postcode',
			name: 'postalCode',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			label: 'Plaats',
			name: 'city',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			label: 'Email',
			name: 'email',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			name: 'id',
			type: 'hidden'
		} as Field<'hidden'>
	],
	formId: 'create-relation-form',
	submitStr: 'Aanmaken'
});
