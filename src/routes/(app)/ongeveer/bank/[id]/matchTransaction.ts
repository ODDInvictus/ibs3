import { z } from 'zod'

export const matchTransactionSchema = z
	.object({
		ref: z.string().optional(),
		relation: z.number().int().optional(),
		id: z.number().int(),
		rows: z.array(
			z.object({
				description: z.string().optional(),
				amount: z.number().step(0.01),
				saldo: z.boolean(),
				journal: z.number().int().optional(),
			}),
		),
	})
	.refine(({ relation, rows }) => (rows.some(r => r.saldo) ? relation : true), {
		message: 'Relatie is verplicht als je saldo wilt toevoegen',
		path: ['relation'],
	})
	.refine(({ rows }) => rows.every(r => !(r.saldo && r.journal)), {
		message: 'Je kan niet een saldo toevoegen en een boekstuk matchen in dezelfde regel',
		path: ['rows'],
	})
	.refine(({ rows }) => rows.every(r => r.saldo || r.journal), {
		message: 'Je moet een boekstuk kiezen of saldo toevoegen',
		path: ['rows'],
	})
