import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit'

export const load = (async () => {
  return {
    categories: await db.productCategory.findMany(),
  }
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const name        = data.get('name') as string
    const description = data.get('description') as string
    const price       = Number(data.get('price'))
    const categoryId  = Number(data.get('categoryId'))
    const productData = JSON.parse(data.get('data') as string) ?? {}

    console.log({ name, description, price, categoryId, productData })

    if (!name || !description || !price || !categoryId) {
      return fail(400, { message: 'Niet alle velden zijn ingevuld' })
    }

    // now check if the category exists
    const category = await db.productCategory.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return fail(400, { message: 'De categorie bestaat niet' })
    }

    // now create the product
    await db.product.create({
      data: {
        name,
        description,
        price,
        category: {
          connect: { id: categoryId }
        },
        data: productData
      }
    })
  }
} satisfies Actions