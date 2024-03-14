import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400);
	const product = await db.product.findUnique({ where: { id }, include: { category: true } });
	if (!product) throw error(404);
	return { product: JSON.parse(JSON.stringify(product)) as typeof product };
}) satisfies PageServerLoad;
