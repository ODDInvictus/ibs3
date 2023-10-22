import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	// Update the saleInvoice date to the current date
	await db.invoice.update({
		where: { id },
		data: { date: new Date() }
	});

	throw redirect(300, `/ongeveer/sales/${id}`);
};
