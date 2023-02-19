import type { PageServerLoad, Actions } from './$types'
import db from "$lib/server/db";
import { ProductType } from '@prisma/client';
import { fail } from '@sveltejs/kit';

import { z } from 'zod'

const productSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(1000),
  price: z.number().min(0.01).max(10000),
  productType: z.string().trim().min(1).max(100),
  data: z.string().default('{}'),
  categoryId: z.number(),
  isActive: z.string().default(true),
})

export const actions = {
  default: async (event) => {
    // huts
    const formData = Object.fromEntries(await event.request.formData())
    const productData = productSchema.safeParse(formData)

    if (!productData.success) {
      return fail(400, productData.error.format())
    }
  }
} satisfies Actions


export const load = (async () => {
  const categories = await db.productCategory.findMany()

  return {
    categories,
    productTypes: Object.values(ProductType)
  }
}) satisfies PageServerLoad
