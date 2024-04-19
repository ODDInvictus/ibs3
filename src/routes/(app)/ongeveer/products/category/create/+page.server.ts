import db from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { categorySchema } from './categorySchema'
import { superValidate } from 'sveltekit-superforms/server'
import { redirect } from 'sveltekit-flash-message/server'

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id') ?? undefined)

	let data = {}
	if (!Number.isNaN(id)) {
		const category = await db.productCategory.findUnique({
			where: {
				id,
			},
		})
		if (!category) throw error(404)
		data = category
	}

	const form = await superValidate(data, categorySchema)

	return { form, id }
}) satisfies PageServerLoad

export const actions = {
	default: async event => {
		const form = await superValidate(event.request, categorySchema)
		if (!form.valid) return fail(400, { form })
		try {
			if (form.data.id) {
				var category = await db.productCategory.update({
					where: {
						id: form.data.id,
					},
					data: form.data,
				})
			} else {
				var category = await db.productCategory.create({
					data: form.data,
				})
			}
		} catch (error) {
			return fail(500)
		}
		throw redirect(
			`/ongeveer/products/category/${category.id}`,
			{
				message: 'Product-categorie opgeslagen',
				title: 'Success',
				type: 'success',
			},
			event,
		)
	},
}
