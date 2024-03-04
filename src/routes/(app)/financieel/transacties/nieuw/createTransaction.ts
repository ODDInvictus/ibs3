import { z } from 'zod';

const amountMsg = 'Vul een geldig bedrag in';

export const createTransactionSchema = z.object({
	amount: z
		.number({ required_error: amountMsg })
		.positive(amountMsg)
		.step(0.01, amountMsg)
		.min(0.01, amountMsg),
	description: z.string().optional(),
	to: z.number().int()
});
