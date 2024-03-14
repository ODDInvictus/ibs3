import db from '$lib/server/db';
import { pagination } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const { p, size } = pagination(url);

	const sales = await db.journalRow.findMany({
		where: {
			Journal: {
				relation: {
					FinancialPersonDataUser: {
						userId: locals.user.id
					}
				},
				date: {
					not: null
				},
				type: 'SALE'
			}
		},
		include: {
			Journal: true
		},
		orderBy: {
			Journal: {
				date: 'desc'
			}
		},
		take: size,
		skip: p * size
	});

	return {
		sales: JSON.parse(JSON.stringify(sales)) as typeof sales,
		p,
		size
	};
}) satisfies PageServerLoad;
