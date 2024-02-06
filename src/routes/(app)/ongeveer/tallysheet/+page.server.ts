import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		sheets: await db.streeplijst.findMany({
			orderBy: { createdAt: 'desc' }
		})
	};
}) satisfies PageServerLoad;
