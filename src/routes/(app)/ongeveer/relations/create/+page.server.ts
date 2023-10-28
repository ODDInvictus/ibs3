import db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { authorization } from '$lib/ongeveer/utils';
import schema from './relationSchema';

export const load = (async ({ url }) => {
	const id = Number(url.searchParams.get('id'));

	// Query the database for the relation if an id is provided
	let relation = null;
	if (id) {
		relation = await db.financialPerson.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				FinancialPersonDataOther: true
			}
		});

		if (!relation) throw error(404);
	}

	// Populate form with existing data if it exists
	const data = relation
		? {
				id: relation.id,
				name: relation.name,
				description: relation.FinancialPersonDataOther?.description ?? undefined,
				iban: relation.FinancialPersonDataOther?.iban ?? undefined,
				address: relation.FinancialPersonDataOther?.address ?? undefined,
				postalCode: relation.FinancialPersonDataOther?.postalCode ?? undefined,
				city: relation.FinancialPersonDataOther?.city ?? undefined,
				email: relation.FinancialPersonDataOther?.email ?? undefined
		  }
		: {};

	const form = await superValidate(data, schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, schema);

		if (!authorization(locals.roles)) throw error(403);
		// If there is inavlid data, return the form with the errors
		if (!form.valid) return fail(400, { form });

		const { name, description, iban, address, postalCode, city, email } = form.data;
		const id = Number(form.data.id);

		try {
			const data = {
				description,
				iban,
				address,
				postalCode,
				city,
				email
			};

			// If there is no id, we are creating a new relation
			if (Number.isNaN(id)) {
				await db.financialPerson.create({
					data: {
						name,
						type: 'OTHER',
						FinancialPersonDataOther: {
							create: data
						}
					}
				});
			} else {
				// If there is an id, we are editing an existing relation
				await db.financialPerson.update({
					where: { id },
					data: {
						name,
						FinancialPersonDataOther: {
							update: data
						}
					}
				});
			}
		} catch (e: any) {
			console.error(e);
			throw error(500, 'Er is iets misgegaan, probeer het later opnieuw');
		}
		// Redirect with custom redirect that shows flash message
		throw redirect(
			'/ongeveer/relations',
			{
				message: `Relatie ${id ? 'aangepast' : 'aangemaakt'}`,
				type: 'success',
				title: 'Succes'
			},
			event
		);
	}
};
