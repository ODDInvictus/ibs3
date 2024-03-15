import type { PageServerLoad, Actions } from './$types';
import db from '$lib/server/db';
import type { ProductType } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { authorization } from '$lib/ongeveer/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { productSchema } from './productSchema';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id'));
	let data = {};
	if (id) {
		const product = await db.product.findUnique({
			where: {
				id
			}
		});
		if (!product) throw fail(404);
		data = {
			...product,
			price: product.price.toNumber()
		};
	}

	const categories = await db.productCategory.findMany();
	const form = await superValidate(data, productSchema);

	const productTypes: ProductType[] = ['FOOD', 'ALCOHOL', 'OTHER'];

	return {
		categories,
		productTypes,
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { locals, request } = event;
		if (!authorization(locals.roles)) return fail(403);
		const form = await superValidate(request, productSchema);
		if (!form.valid) return fail(400, { form });
		try {
			if (form.data.id) {
				var product = await db.product.update({
					where: {
						id: form.data.id
					},
					data: form.data
				});
			} else {
				var product = await db.product.create({
					data: {
						...form.data,
						data: {}
					}
				});
			}
		} catch (error) {
			return fail(500);
		}
		throw redirect(
			`/ongeveer/products/${product.id}`,
			{
				message: `Product "${product.name}" opgeslagen.`,
				title: 'Succes',
				type: 'success'
			},
			event
		);
	}
} satisfies Actions;
