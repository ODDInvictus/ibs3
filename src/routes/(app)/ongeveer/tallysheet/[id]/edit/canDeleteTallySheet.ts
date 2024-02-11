import db from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const canDeleteTallySheet = async (id: number) => {
	let tallySheet;
	try {
		tallySheet = await db.streeplijst.findUnique({
			where: { id },
			select: {
				sales: {
					select: {
						TransactionMatchRow: true
					}
				}
			}
		});
	} catch (e) {
		console.error(e);
		throw error(500);
	}
	if (!tallySheet) throw error(404);

	return !tallySheet.sales.some((s) => s.TransactionMatchRow.length > 0);
};
