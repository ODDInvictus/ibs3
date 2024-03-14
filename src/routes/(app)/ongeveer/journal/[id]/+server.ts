import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw error(400, 'Invalid id');

	const journal = await db.journal.findUnique({
		where: { id },
		select: { type: true }
	});
	if (!journal) throw error(404);

	if (journal.type === 'SALE') {
		throw redirect(308, `/ongeveer/sales/${id}`);
	}
	if (journal.type === 'PURCHASE' || journal.type === 'DECLARATION') {
		throw redirect(308, `/ongeveer/purchases/${id}`);
	}

	const errorMessage = `Ongeveer weet niet waar hij je heen moet verwijzen, omdat het type van de journal (${journal.type}) met ID ${id} onbekend is.`;
	console.error(errorMessage);
	throw error(500, errorMessage);
};
