import type { PageServerLoad } from './$types';
import { getJournal } from '../getJournal';

// TODO force light mode
export const load = (async ({ params }) => {
	const id = Number(params.id);
	const invoice = await getJournal(id);
	return { invoice };
}) as PageServerLoad;
