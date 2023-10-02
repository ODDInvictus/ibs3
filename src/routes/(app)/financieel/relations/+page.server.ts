import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		relations: db.financialPerson.findMany({
			where: {
				type: 'OTHER'
			},
			include: {
				FinancialPersonDataOther: true
			}
		})
	};
}) satisfies PageServerLoad;
