import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, locals }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(400, 'Invalid ID')

	const tallySheet = await db.streeplijst.findUnique({
		where: { id },
		select: {
			startDate: true,
			endDate: true,
			createdAt: true,
			id: true,
			sales: {
				where: {
					relation: {
						FinancialPersonDataUser: {
							userId: locals.user.id,
						},
					},
				},
				select: {
					Rows: true,
				},
			},
		},
	})

	if (!tallySheet) throw error(404, 'Tally sheet not found')

	return { tallySheet: JSON.parse(JSON.stringify(tallySheet)) as typeof tallySheet }
}) satisfies PageServerLoad
