import { z } from 'zod'

export default z.object({
	name: z.string({ required_error: 'Naam is verplicht' }).min(1, 'Naam is verplicht'),
	description: z.string().optional(),
	iban: z.string().optional(),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	email: z.string().email('Ongeldig e-mailadres').optional(),
	id: z.number().int().optional(),
})
