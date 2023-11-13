import { Roles } from '$lib/constants';
import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';

export const editRefForm = new Form<{
	ref?: string;
	id: string;
}>({
	title: 'Bewerk referentie',
	formId: 'edit-ref',
	submitStr: 'Opslaan',
	fields: [
		{
			name: 'ref',
			label: 'Referentie',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			name: 'id',
			type: 'hidden'
		} as Field<'hidden'>
	],
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	logic: async ({ ref, id }) => {
		await db.journal.update({
			where: {
				id: Number(id)
			},
			data: {
				ref
			}
		});

		return {
			success: true,
			message: 'Referentie opgeslagen',
			status: 200,
			redirectTo: `/ongeveer/sales/${id}`
		};
	}
});
