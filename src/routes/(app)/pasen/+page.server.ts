import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		eggs: JSON.parse(
			JSON.stringify(
				await db.egg.findMany({
					select: {
						name: true,
						img: true,
						found: true
					}
				})
			)
		)
	};
}) satisfies PageServerLoad;
