import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { authorization } from '$lib/ongeveer/utils'

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) error(400)

	if (!authorization(locals.roles)) error(403)

	await db.$transaction(async tx => {
		// Check if the tally sheet can be deleted
		// TODO: use canDeleteTallySheet
		let tallySheet
		try {
			tallySheet = await tx.streeplijst.findUnique({
				where: { id },
				select: {
					sales: {
						select: {
							TransactionMatchRow: true,
						},
					},
				},
			})
		} catch (e) {
			console.error(e)
			error(500)
		}
		if (!tallySheet) error(404)

		if (tallySheet.sales.some(s => s.TransactionMatchRow.length > 0)) {
			error(409, {
				message: 'Streeplijst kan niet verwijderd worden omdat deze al betaald is.',
			})
		}

		try {
			// Delete journals
			await tx.journal.deleteMany({
				where: {
					streeplijstId: id,
				},
			})

			// Delete the tally sheet
			await tx.streeplijst.delete({
				where: { id },
			})
		} catch (e) {
			console.error(e)
			error(500)
		}
	})

	return new Response(null, { status: 200 })
}
