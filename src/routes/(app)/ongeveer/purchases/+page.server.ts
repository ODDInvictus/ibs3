import { getJournals } from '$lib/ongeveer/db';
import { pagination } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const { p, size } = pagination(url);

	return {
		journals: getJournals({ type: ['PURCHASE', 'DECLARATION'], pagination: { p, size } }),
		p,
		size
	};
}) satisfies PageServerLoad;
