import type { PageServerLoad, Actions } from './$types'
import db from "$lib/server/db";
import { ProductType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

import { z } from 'zod'
import { authFinance } from '$lib/server/authorizationMiddleware';

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
    // First check authorization
    const [authorized, committees] = authFinance(event.locals)
    if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))
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
