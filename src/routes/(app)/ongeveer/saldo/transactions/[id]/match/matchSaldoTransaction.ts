import { z } from 'zod'

export const matchSaldoTransaction = z.object({
	rows: z.array(
		z.object({
			description: z.string().optional(),
			amount: z
				.number()
				.step(0.01)
				.refine(x => x != 0),
			journal: z.number().int(),
		}),
	),
})
