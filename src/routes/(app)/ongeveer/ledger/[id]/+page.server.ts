import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(404, 'Not found');

	return {
		ledger: db.ledger.findUnique({
			where: { id },
			include: {
				Transaction: {
					orderBy: {
						createdAt: 'desc'
					}
				}
			}
		})
	};
}) satisfies PageServerLoad;
