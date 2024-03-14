import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400, 'Invalid id');

	const relation = await db.financialPerson.findUnique({
		where: { id },
		include: {
			FinancialPersonDataOther: true,
			_count: {
				select: {
					Journal: true,
					BankTransactionFrom: true,
					Acquisition: true,
					TransactionFrom: true,
					TransactionTo: true
				}
			}
		}
	});

	if (!relation) throw error(404);

	return {
		relation: JSON.parse(JSON.stringify(relation)) as typeof relation
	};
}) satisfies PageServerLoad;
