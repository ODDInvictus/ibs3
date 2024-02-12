import { z } from 'zod';

export const declatationSchema = z
	.object({
		product: z.string({ required_error: 'Verplicht' }).min(1, 'Verplicht'),
		methodOfPayment: z.string({ required_error: 'Verplicht' }),
		price: z
			.number({ required_error: 'Verplicht', invalid_type_error: 'Verplicht' })
			.min(0.01, 'Prijs kan niet negatief of 0 zijn')
			.step(0.01, 'Prijs moet een geldig bedrag zijn'),
		receiveMethod: z.enum(['ACCOUNT', 'SALDO']),
		iban: z.string()
	})
	.refine(({ receiveMethod, iban }) => (receiveMethod === 'ACCOUNT' ? !!iban : true));
