import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	// Update the journal date to the current date
	const journal = await db.journal.update({
		where: { id, date: null },
		data: { date: new Date() }
	});

	if (!journal) throw error(404, `Journal #${id} not found`);

	throw redirect(301, `/ongeveer/sales/${id}`);
};
