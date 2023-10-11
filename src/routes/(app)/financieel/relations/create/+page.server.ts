import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createRelationForm } from './createRelation';

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id'));

	if (id) {
		const relation = await db.financialPerson.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				FinancialPersonDataOther: true
			}
		});

		if (!relation) throw error(404);

		await createRelationForm.transform({
			values: {
				name: relation.name,
				description: relation.FinancialPersonDataOther?.description ?? undefined,
				iban: relation.FinancialPersonDataOther?.iban ?? undefined,
				address: relation.FinancialPersonDataOther?.address ?? undefined,
				postalCode: relation.FinancialPersonDataOther?.postalCode ?? undefined,
				city: relation.FinancialPersonDataOther?.city ?? undefined,
				email: relation.FinancialPersonDataOther?.email ?? undefined,
				id: relation.id.toString()
			}
		});
	} else {
		await createRelationForm.transform();
	}

	return {
		form: createRelationForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = createRelationForm.actions;
