import { ProductType } from '@prisma/client'
import { z } from 'zod'

export const productSchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().min(1).max(1000),
	price: z.number().min(0.01).step(0.01),
	productType: z.nativeEnum(ProductType),
	categoryId: z.number(),
	isActive: z.boolean().default(true),
	id: z.number().int().optional(),
})
