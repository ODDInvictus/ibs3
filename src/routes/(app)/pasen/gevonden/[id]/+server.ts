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

	// Update the `found` field which is a byte array where each bit represent a user
	// User ID 1 is the the least significant bit of the first byte
	const uid = locals.user.id;
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

	throw redirect(303, `/pasen/${egg.name}`);
};
