import type { PageServerLoad } from './$types';
import { createInvoiceForm } from './createInvoiceForm';

export const load = (async () => {
	await createInvoiceForm.transform();

	return {
		form: createInvoiceForm.attributes
	};
}) satisfies PageServerLoad;

export const actions = createInvoiceForm.actions;
