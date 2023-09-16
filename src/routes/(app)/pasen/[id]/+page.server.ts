import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const egg = await db.egg.findUnique({
		where: {
			id: params.id
		}
	});
	if (!egg) return {};

	const uid = locals.user.id;

	// TODO
	if (uid > 32) throw new Error('User mogen geen ID hebben groter dan 32.');

	const mask = 1 << (uid - 1);

	console.log(
		'test',
		[...egg.found].map((x) => x.toString(2))
	);

	return {
		egg: JSON.parse(
			JSON.stringify(
				await db.egg.findUnique({
					where: {
						id: params.id
					}
				})
			)
		)
	};
}) satisfies PageServerLoad;
