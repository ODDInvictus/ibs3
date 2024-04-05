import { z } from 'zod'

export const categorySchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().min(1).max(1000),
	isActive: z.boolean().default(true),
	id: z.number().int().optional(),
})
