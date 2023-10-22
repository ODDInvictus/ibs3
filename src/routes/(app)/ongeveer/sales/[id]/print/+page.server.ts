import type { PageServerLoad } from './$types';
import { getInvoice } from '../getInvoice';

// TODO force light mode
export const load = (async ({ params }) => {
	const id = Number(params.id);
	const invoice = await getInvoice(id);
	return { invoice };
}) as PageServerLoad;
