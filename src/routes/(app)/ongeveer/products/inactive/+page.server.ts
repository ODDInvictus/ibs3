import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		products: db.product.findMany({
			where: { isActive: false },
			select: { id: true, name: true }
		})
	};
}) satisfies PageServerLoad;
