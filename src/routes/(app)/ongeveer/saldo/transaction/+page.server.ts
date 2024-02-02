import type { PageServerLoad, Actions } from './$types';
import db from '$lib/server/db';
import { z } from 'zod';
import { isFinancie } from '$lib/server/authorization';
import { createTransacton } from '$lib/ongeveer/db';

export const load = (async () => {
	const fp = await db.financialPerson.findMany({
		where: { isActive: true }
	});

	const financialPeople: { [key: string]: typeof fp } = {};

	for (const person of fp) {
		// TODO remove this line when support is added for committees.
		if (person.type !== 'USER' && person.type !== 'INVICTUS') continue;

		const arr = financialPeople[person.type] || [];
		arr.push(person);
		financialPeople[person.type] = arr;
	}

	return {
		financialPeople,
		products: await db.product.findMany()
	};
}) satisfies PageServerLoad;

const formSchema = z.object({
	giver: z.number().positive().int(),
	receiver: z.number().positive().int(),
	amount: z.number().positive().min(0.01).step(0.01),
	description: z.string().min(1).max(255)
});

export const actions = {
	default: async ({ request, locals }) => {
		// first check if user is aurhorized to do this
		if (!locals.user) {
			return {
				success: false,
				message: 'Je bent niet ingelogd'
			};
		}

		// Check if user is financie
		if (!isFinancie(locals.user)) {
			return {
				success: false,
				message: 'Je bent niet geautoriseerd om deze actie uit te voeren'
			};
		}

		const data = await request.formData();

		// Validate form with formSchema
		const parse = formSchema.safeParse({
			giver: Number.parseInt(data.get('giver')?.toString() ?? '-1'),
			receiver: Number.parseInt(data.get('receiver')?.toString() ?? '-1'),
			amount: Number.parseFloat(data.get('amount')?.toString() || '0'),
			description: data.get('description')
		});

		if (!parse.success) {
			return {
				success: false,
				error: parse.error.format()
			};
		}

		const saldoTransaction = await createTransacton(parse.data);

		return {
			success: true,
			message: 'Transactie is succesvol toegevoegd',
			data: saldoTransaction
		};
	}
} satisfies Actions;
