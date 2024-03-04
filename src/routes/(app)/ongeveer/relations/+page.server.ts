import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		relations: db.financialPerson.findMany({
			where: {
				type: 'OTHER',
				isActive: true
			},
			select: {
				FinancialPersonDataOther: {
					select: {
						description: true
					}
				},
				id: true,
				name: true
			}
		})
	};
}) satisfies PageServerLoad;
