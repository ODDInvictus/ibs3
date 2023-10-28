import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { getLedgers, getRelations } from '$lib/ongeveer/db';

const schema = z.object({
	id: z.number().int().optional(),
	ref: z.string().optional(),
	date: z.date(),
	termsOfPayment: z.number().int().min(0),
	relation: z.number().int(),
	type: z.enum(['PURCHASE', 'DECLARATION']),
	rows: z
		.object({
			amount: z.number().int().min(0, 'Aantal mag niet negatief zijn'),
			price: z
				.number()
				.min(0, 'Prijs mag niet negatief zijn')
				.step(0.01, 'Prijs moet een geldig bedrag zijn'),
			description: z.string(),
			ledger: z.number().int()
		})
		.array()
		.min(1, 'Er moet minimaal 1 regel zijn')
});

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id'));

	let form;
	if (!id) {
		form = await superValidate(schema);
	} else {
		const purchase = await db.invoice.findUnique({
			where: { id },
			include: {
				rows: true
			}
		});

		if (!purchase) throw error(404);

		form = await superValidate(
			{
				id: purchase.id,
				ref: purchase.ref ?? undefined,
				date: purchase.date ?? undefined,
				termsOfPayment: purchase.termsOfPayment,
				relation: purchase.relationId,
				rows: purchase.rows.map((row) => ({
					amount: row.amount,
					price: row.price.toNumber(),
					description: row.description,
					ledger: row.ledgerId
				}))
			},
			schema
		);
	}

	return { form, relations: await getRelations(), ledgers: await getLedgers() };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);

		if (!authorization(locals.roles)) return fail(403, { form });
		if (!form.valid) return fail(400, { form });

		const { id, ref, date, termsOfPayment, relation, rows, type } = form.data;

		if (id) {
			// TODO check if purchase can be updated
			await db.invoice.update({
				where: { id },
				data: {
					ref,
					date,
					termsOfPayment,
					relationId: relation,
					rows: {
						deleteMany: {},
						create: rows.map(({ amount, price, description, ledger }) => ({
							amount,
							price,
							description,
							ledgerId: ledger
						}))
					}
				}
			});

			return message(form, 'Purchase updated successfully!');
		}

		await db.invoice.create({
			data: {
				type,
				ref,
				date,
				termsOfPayment,
				relationId: relation,
				rows: {
					create: rows.map(({ amount, price, description, ledger }) => ({
						amount,
						price,
						description,
						ledgerId: ledger
					}))
				}
			}
		});

		return message(form, 'Purchase created successfully!');
	}
};
