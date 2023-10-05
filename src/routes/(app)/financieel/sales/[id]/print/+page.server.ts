import type { PageServerLoad } from './$types';
import loadInvoice from '../loadInvoice';

// Geen layouts want dit is een print pagina
// @ts-expect-error
export const load = loadInvoice as PageServerLoad;
