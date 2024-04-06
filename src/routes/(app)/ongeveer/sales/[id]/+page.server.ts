import type { PageServerLoad } from './$types'
import { getJournal } from './getJournal'
import { editRefForm } from './editRef'

export const load = (async ({ params }) => {
	const id = Number(params.id)

	const { journal, paid, toPay, total } = await getJournal(id)

	await editRefForm.transform({
		values: {
			ref: journal.ref ?? '',
			id: journal.id.toString(),
		},
	})

	return {
		invoice: JSON.parse(JSON.stringify(journal)) as typeof journal,
		form: editRefForm.attributes,
		paid,
		toPay,
		total,
	}
}) satisfies PageServerLoad

export const actions = editRefForm.actions
