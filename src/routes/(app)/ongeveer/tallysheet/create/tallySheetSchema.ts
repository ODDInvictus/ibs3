import { z } from 'zod';

export const tallySheetSchema = z.object({
	notes: z.string().optional(),
	start: z.date().optional(),
	end: z.date().optional(),
	rows: z
		.array(
			z.object({
				amount: z.number().int().min(1),
				productId: z.number().int(),
				financialPersonId: z.number().int()
			})
		)
		.min(1)
});
