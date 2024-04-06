import { z } from 'zod'

export default z.object({
	id: z.number().int().optional(),
	ref: z.string().optional(),
	date: z.date(),
	termsOfPayment: z.number().int().min(0),
	relation: z.number({ required_error: 'Verplicht' }).int().min(1, 'Verplicht'),
	type: z.enum(['PURCHASE', 'DECLARATION'], { required_error: 'Type is verplicht' }),
	attatchments: z.instanceof(Array).array().optional(),
	rows: z
		.object({
			amount: z.number().int().min(0, 'Aantal mag niet negatief zijn'),
			price: z
				.number()
				.step(0.01, 'Prijs moet een geldig bedrag zijn')
				.refine(x => x !== 0, 'Prijs moet een geldig bedrag zijn'),
			description: z.string(),
			ledger: z.number().int().min(1, 'Verplicht'),
		})
		.array()
		.min(1, 'Er moet minimaal 1 regel zijn'),
})
