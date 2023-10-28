import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { getLedgers, getRelations } from '$lib/ongeveer/db';
import schema from './pruchaseSchema';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id'));

	let purchase = null;
	if (id) {
		purchase = await db.invoice.findUnique({
			where: { id },
			include: {
				rows: true
			}
		});
		if (!purchase) throw error(404);
	}

	const data = purchase
		? {
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
		  }
		: {
				rows: [{ amount: 1, price: 0, description: '', ledger: 0 }]
		  };

	const form = await superValidate(data, schema);

	return { form, relations: await getRelations(), ledgers: await getLedgers() };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, schema);

		if (!authorization(locals.roles)) throw error(403);
		if (!form.valid) return fail(400, { form });

		const { id, ref, date, termsOfPayment, relation, rows, type } = form.data;

		try {
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
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		throw redirect(
			'/ongeveer/purchases',
			{
				message: `Aankoop boeking ${id ? 'aangepast' : 'aangemaakt'}`,
				type: 'success',
				title: 'Succes'
			},
			event
		);
	}
};
