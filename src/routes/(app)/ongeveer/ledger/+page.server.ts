import db from '$lib/server/db'
import { createForm } from './createForm'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	await createForm.transform()

	return {
		ledgers: await db.ledger.findMany({
			orderBy: {
				id: 'asc',
			},
			where: {
				isActive: true,
			},
		}),
		form: createForm.attributes,
	}
}) satisfies PageServerLoad

export const actions = createForm.actions
