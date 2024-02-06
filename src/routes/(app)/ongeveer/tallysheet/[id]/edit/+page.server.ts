import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { superValidate } from 'sveltekit-superforms/server';
import { editTallySheetSchema } from './editTallySheetSchema';
import type { Actions } from './$types';
import { authorization } from '$lib/ongeveer/utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400);

	const tallySheet = await db.streeplijst.findUnique({
		where: { id }
	});
	if (!tallySheet) throw error(404);

	const data = {
		begin: tallySheet.startDate ?? undefined,
		end: tallySheet.endDate ?? undefined,
		notes: tallySheet.notes ?? undefined
	};
	const form = await superValidate(data, editTallySheetSchema);

	return { form, id };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { locals, request, params } = event;

		const id = Number(params.id);
		if (Number.isNaN(id)) return fail(400);

		if (!authorization(locals.roles)) return fail(403);

		const form = await superValidate(request, editTallySheetSchema);
		if (!form.valid) return fail(400, { form });

		const { data } = form;
		try {
			const tallySheet = await db.streeplijst.update({
				where: { id },
				data: {
					startDate: data.begin,
					endDate: data.end,
					notes: data.notes
				}
			});
			if (!tallySheet) return fail(404);
		} catch (e) {
			console.error(e);
			return fail(500);
		}

		throw redirect(
			`/ongeveer/tallysheet/${id}`,
			{
				message: 'Streeplijst aangepast',
				type: 'success',
				title: 'Succes'
			},
			event
		);
	}
} satisfies Actions;
