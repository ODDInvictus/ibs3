import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const GET: RequestHandler = async ({ locals, params }) => {
	const egg = await db.egg.findUnique({
		where: {
			id: params.id
		}
	});
	if (!egg) throw redirect(303, '/pasen');

	console.log('kaas');

	const uid = 40; // locals.user.id;
	const idx = Math.floor((uid - 1) / 8);
	const mask = 1 << (uid - 1) % 8;
	const result = [...egg.found];
	result[idx] = mask | egg.found[idx];

	await db.egg.update({
		where: {
			id: egg.id
		},
		data: {
			found: Buffer.from(result)
		}
	});

	throw redirect(303, `/pasen/${egg.id}`);
};
