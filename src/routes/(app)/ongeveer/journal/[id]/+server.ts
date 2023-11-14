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

	if (journal.type === 'SALE') throw redirect(300, `/ongeveer/sales/${id}`);
	if (journal.type === 'PURCHASE') throw redirect(300, `/ongeveer/purchases/${id}`);
	throw error(501);
};
