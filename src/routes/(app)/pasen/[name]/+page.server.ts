import db from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (async ({ params, locals }) => {
	const egg = await db.egg.findUnique({
		where: {
			name: params.name
		}
	});
	if (!egg) throw redirect(303, '/pasen');

	// Compute a list of user ids that have found the egg
	const uids = [];
	const bytes = [...egg.found];
	for (const [i, byte] of bytes.entries()) {
		for (let j = 0; j < 8; j++) {
			const mask = 1 << j;
			if (byte & mask) uids.push(j + 1 + 8 * i);
		}
	}

	if (!uids.includes(locals.user.id)) throw redirect(303, '/pasen');

	return {
		egg: { name: egg.name, img: egg.img },
		users: db.user.findMany({
			where: {
				id: {
					in: uids
				}
			},
			select: {
				id: true,
				firstName: true,
				nickname: true,
				lastName: true,
				profilePictureId: true,
				ldapId: true
			}
		})
	};
}) satisfies PageServerLoad;
