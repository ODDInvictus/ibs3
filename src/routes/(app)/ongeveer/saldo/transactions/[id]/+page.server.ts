import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(404, 'Not found');

	const transaction = await db.saldoTransaction.findUnique({
		where: { id },
		include: {
			Transaction: true,
			from: true,
			to: true,
			TransactionMatchRow: {
				select: {
					Transaction: {
						select: {
							id: true,
							type: true
						}
					}
				}
			}
		}
	});

	if (!transaction) throw error(404);

	return { transaction };
}) satisfies PageServerLoad;
