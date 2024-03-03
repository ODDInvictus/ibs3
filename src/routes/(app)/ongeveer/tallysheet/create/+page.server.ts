import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { tallySheetSchema } from './tallySheetSchema';
import db from '$lib/server/db';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, type Actions } from '@sveltejs/kit';
import { authorization } from '$lib/ongeveer/utils';
import type { ProductType } from '@prisma/client';
import type { z } from 'zod';
import { getLedgerIds } from '$lib/ongeveer/db';

export const load = (async () => {
	// Add 1 empty row
	const data: z.infer<typeof tallySheetSchema> = {
		rows: [{ financialPersonId: NaN, productId: NaN, amount: NaN }]
	};

	const form = await superValidate(data, tallySheetSchema);

	const products = await db.product.findMany({
		where: { isActive: true },
		select: { id: true, price: true, name: true }
	});

	const financialPersons = await db.financialPerson.findMany({
		// TODO: Add support for groups
		where: { isActive: true, type: 'USER' },
		select: {
			id: true,
			name: true,
			FinancialPersonDataUser: { select: { user: { select: { nickname: true } } } }
		}
	});

	return {
		form,
		products: products.map((p) => {
			return { ...p, price: p.price.toNumber() };
		}),
		financialPersons
	};
}) satisfies PageServerLoad;

function groupByPersonAndGetProducts(
	data: { financialPersonId: number; productId: number; amount: number }[]
) {
	const result = new Map<number, { productId: number; amount: number }[]>();
	const products = new Set<number>();
	for (const { financialPersonId, productId, amount } of data) {
		if (
			Number.isNaN(amount ?? undefined) ||
			Number.isNaN(productId ?? undefined) ||
			Number.isNaN(financialPersonId ?? undefined)
		)
			continue;
		const current = result.get(financialPersonId) || [];
		result.set(financialPersonId, [...current, { productId, amount }]);
		products.add(productId);
	}
	return {
		grouped: result,
		productIds: Array.from(products)
	};
}

function getLedger(productType: ProductType, ledgers: Awaited<ReturnType<typeof getLedgerIds>>) {
	switch (productType) {
		case 'ALCOHOL':
			return ledgers.DEFAULT_SALE_BEER_LEDGER;
		case 'FOOD':
			return ledgers.DEFAULT_SALE_FOOD_LEDGER;
		default:
			return ledgers.DEFAULT_SALE_OTHER_LEDGER;
	}
}

export const actions = {
	default: async (event) => {
		const { locals, request } = event;
		if (!authorization(locals.roles)) return fail(403);
		const form = await superValidate(request, tallySheetSchema);
		if (!form.valid) return fail(400, { form });

		const { grouped, productIds } = groupByPersonAndGetProducts(form.data.rows);

		try {
			const tallySheetPromise = db.streeplijst.create({
				data: {
					notes: form.data.notes,
					userId: locals.user.id,
					startDate: form.data.start,
					endDate: form.data.end
				}
			});

			const productsPromise = db.product.findMany({
				where: { id: { in: productIds } }
			});

			const ledgersPromise = getLedgerIds();

			const [tallySheet, products, ledgers] = await Promise.all([
				tallySheetPromise,
				productsPromise,
				ledgersPromise
			]);

			await Promise.all(
				Array.from(grouped.entries()).map(([financialPersonId, rows]) => {
					const description = `User #${financialPersonId} Streeplijst #${tallySheet.id}`;
					return db.journal.create({
						data: {
							ref: description,
							description,
							termsOfPayment: 30,
							relationId: financialPersonId,
							treasurerId: locals.user.id,
							streeplijstId: tallySheet.id,
							date: new Date(),
							type: 'SALE',
							Rows: {
								createMany: {
									data: rows.map((row) => {
										const product = products.find((p) => p.id === row.productId);
										if (!product) throw new Error('Product not found');
										return {
											...row,
											price: product.price,
											description: product.name,
											ledgerId: getLedger(product.productType, ledgers)
										};
									})
								}
							}
						}
					});
				})
			);
		} catch (error) {
			console.error(error);
			return fail(500);
		}

		throw redirect(
			`/ongeveer/tallysheet`,
			{
				message: `Streeplijst opgeslagen`,
				title: 'Succes',
				type: 'success'
			},
			event
		);
	}
} satisfies Actions;
