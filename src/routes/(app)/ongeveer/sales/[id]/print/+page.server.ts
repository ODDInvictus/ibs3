import type { PageServerLoad } from './$types'
import { getJournal } from '../getJournal'
import { error } from '@sveltejs/kit'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw new Error('Niet gevonden')
	const { journal: invoice } = await getJournal(id)
	if (!invoice) error(404, 'Niet gevonden')
	return { invoice: JSON.parse(JSON.stringify(invoice)) as typeof invoice }
}) as PageServerLoad
