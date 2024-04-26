import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const canDeleteTallySheet = async (id: number) => {
	let tallySheet
	try {
		tallySheet = await db.streeplijst.findUnique({
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

	return !tallySheet.sales.some(s => s.TransactionMatchRow.length > 0)
}
