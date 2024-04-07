import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) error(400)
	const catergory = await db.productCategory.findUnique({
		where: { id },
	})
	if (!catergory) error(404)

	const products = await db.product.findMany({
		where: {
			categoryId: id,
			isActive: true,
		},
	})

	const productsSerialized = products.map(p => {
		return { ...p, price: p.price.toNumber() }
	})

	return { catergory, products: productsSerialized }
}) satisfies PageServerLoad
