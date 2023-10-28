import { getInvoices } from '$lib/ongeveer/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		invoices: getInvoices('PURCHASE')
	};
}) satisfies PageServerLoad;
