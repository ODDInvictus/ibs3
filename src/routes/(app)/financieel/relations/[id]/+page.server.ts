import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400, 'Invalid id');

	return {
		relation: db.financialPerson.findUnique({
			where: { id },
			include: { FinancialPersonDataOther: true }
		})
	};
}) satisfies PageServerLoad;
