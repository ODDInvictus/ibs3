import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { tallySheetIsProcessed } from '$lib/ongeveer/db'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) return error(400)

	const tallySheet = await db.streeplijst.findUnique({
		where: { id },
		include: {
			treasurer: {
				select: {
					firstName: true,
				},
			},
			sales: {
				include: {
					Rows: true,
					relation: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	})

	if (!tallySheet) return error(404)

	const isProcessed = await tallySheetIsProcessed(id)

	return { tallySheet: JSON.parse(JSON.stringify(tallySheet)) as typeof tallySheet, isProcessed }
}) satisfies PageServerLoad
