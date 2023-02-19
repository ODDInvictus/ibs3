import type { Actions } from './$types'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(1000),
  price: z.number().min(0.01).max(10000),
  productType: z.string().trim().min(1).max(100),
  data: z.string().default('{}'),
  categoryId: z.number(),
  isActive: z.boolean().default(true),
})

export const actions = {
  default: async (event) => {
    // huts
    const formData = Object.fromEntries(await event.request.formData())
    const productData = productSchema.safeParse(formData)
    console.log(productData)
  }
} satisfies Actions