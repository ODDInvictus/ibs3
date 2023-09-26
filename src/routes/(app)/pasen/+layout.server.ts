import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async () => {
	const enabled = await db.settings.findUnique({
		where: {
			name: 'EGGHUNT_ENABLED'
		},
		select: {
			value: true
		}
	});
	if (!enabled || enabled.value != '1') throw redirect(303, '/');
}) satisfies LayoutServerLoad;
