import type { PageServerLoad } from './$types';
import { getJournal } from './getJournal';
import { editRefForm } from './editRef';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const id = Number(params.id);

	const invoice = await getJournal(id);

	if (!invoice.date) throw redirect(302, `/financieel/sales/create?id=${id}`);

	await editRefForm.transform({
		values: {
			ref: invoice.ref ?? '',
			id: invoice.id.toString()
		}
	});

	return {
		invoice,
		form: editRefForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = editRefForm.actions;
