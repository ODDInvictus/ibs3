import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(404, 'Not found');

	const transaction = db.transaction.findUnique({
		where: { id, type: 'SALDO' },
		include: {
			SaldoTransaction: {
				include: {
					from: true,
					to: true
				}
			}
		}
	});

	if (!transaction?.SaldoTransaction) throw error(404);

	return { transaction };
}) satisfies PageServerLoad;
