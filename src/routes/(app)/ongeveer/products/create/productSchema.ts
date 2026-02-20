import type { ProductType } from '$lib/server/prisma/client'
import { z } from 'zod'

export function getProductSchema(ProductTypes: [ProductType, ...ProductType[]]) {
	return z.object({
		name: z.string().trim().min(1).max(100),
		description: z.string().trim().min(1).max(1000),
		price: z.number().min(0.01).step(0.01),
		productType: z.enum(ProductTypes),
		categoryId: z.number(),
		isActive: z.boolean().default(true),
		id: z.number().int().optional(),
	})
}
