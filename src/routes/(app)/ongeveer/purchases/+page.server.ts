import { getJournals } from '$lib/ongeveer/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		invoices: getJournals('PURCHASE'),
		declarations: getJournals('DECLARATION')
	};
}) satisfies PageServerLoad;
