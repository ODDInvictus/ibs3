import db from '$lib/server/db';
import Decimal from 'decimal.js';

export const load = async ({ locals }) => {
	const declarations = await db.journal.findMany({
		where: {
			type: 'DECLARATION',
			relation: {
				FinancialPersonDataUser: {
					userId: locals.user.id
				}
			}
		},
		include: {
			DeclarationData: true,
			Rows: true
		}
	});

	const data = declarations.map(({ id, date, DeclarationData, Rows, description }) => ({
		id,
		date,
		methodOfPayment: DeclarationData?.methodOfPayment ?? null,
		description,
		total: Rows.reduce(
			(acc, { price, amount }) => acc.add(new Decimal(price).mul(amount)),
			new Decimal(0)
		).toNumber()
	}));

	return { declarations: data };
};
