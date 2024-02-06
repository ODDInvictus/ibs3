import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400);

	const tallySheet = await db.streeplijst.findUnique({
		where: { id },
		select: {
			sales: {
				select: {
					TransactionMatchRow: true
				}
			}
		}
	});
	if (!tallySheet) throw error(404);

	if (tallySheet.sales.some((s) => s.TransactionMatchRow.length > 0)) {
		throw error(400, {
			message: 'Streeplijst kan niet verwijderd worden omdat deze al betaald is.'
		});
	}

	return new Response(null, { status: 200 });
};
