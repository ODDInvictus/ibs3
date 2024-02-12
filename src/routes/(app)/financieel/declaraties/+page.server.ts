import db from '$lib/server/db';
import Decimal from 'decimal.js';

export const load = async ({ locals }) => {
	const declarations = await db.declarationData.findMany({
		where: {
			DeclaratedBy: {
				FinancialPersonDataUser: {
					userId: locals.user.id
				}
			}
		},
		select: {
			createdAt: true,
			id: true,
			methodOfPayment: true,
			askedAmount: true,
			status: true,
			Journal: {
				select: {
					description: true,
					id: true,
					Rows: {
						select: {
							price: true,
							amount: true
						}
					}
				}
			}
		}
	});

	const data = declarations.map(
		({ Journal, createdAt, methodOfPayment, status, askedAmount, id }) => ({
			id,
			date: createdAt,
			methodOfPayment: methodOfPayment ?? null,
			description: Journal?.description ?? null,
			status,
			total:
				Journal?.Rows.reduce(
					(acc, { price, amount }) => acc.add(new Decimal(price).mul(amount)),
					new Decimal(0)
				).toNumber() ?? askedAmount.toNumber()
		})
	);

	return { declarations: data };
};
