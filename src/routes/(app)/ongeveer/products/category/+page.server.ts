import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		categories: await db.productCategory.findMany({
			where: { isActive: true },
			select: { id: true, name: true }
		})
	};
}) satisfies PageServerLoad;
