import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { tallySheetSchema } from './tallySheetSchema';
import db from '$lib/server/db';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, type Actions, error } from '@sveltejs/kit';
import { authorization } from '$lib/ongeveer/utils';
import { LEDGER_IDS } from '$lib/constants';
import type { ProductType } from '@prisma/client';
import type { z } from 'zod';

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
		where: { isActive: true },
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

function getLedger(productType: ProductType) {
	switch (productType) {
		case 'ALCOHOL':
			return LEDGER_IDS.SALE_BEER;
		case 'FOOD':
			return LEDGER_IDS.SALE_FOOD;
		default:
			return LEDGER_IDS.SALE_OTHER;
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
			const tallySheet = await db.streeplijst.create({
				data: {
					notes: form.data.notes,
					userId: locals.user.id,
					startDate: form.data.start,
					endDate: form.data.end
				}
			});

			const products = await db.product.findMany({
				where: { id: { in: productIds } }
			});

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
											ledgerId: getLedger(product.productType)
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
