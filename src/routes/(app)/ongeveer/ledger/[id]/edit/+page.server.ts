import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import { editForm } from './editForm'

export const load = (async ({ params, locals }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(404, 'Not found')

	const ledger = await db.ledger.findUnique({
		where: { id },
		include: {
			_count: {
				select: {
					JournalRows: true,
				},
			},
		},
	})
	if (!ledger) throw error(404, 'Not found')

	await editForm.transform({
		values: {
			id: ledger.id,
			name: ledger.name,
			description: ledger.description,
			prevId: ledger.id,
		},
	})

	return { form: editForm.attributes, ledger }
}) satisfies PageServerLoad

export const actions = editForm.actions
