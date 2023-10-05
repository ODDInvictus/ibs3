import type { PageServerLoad } from './$types';
import loadInvoice from './loadInvoice';

export const load = loadInvoice satisfies PageServerLoad;
