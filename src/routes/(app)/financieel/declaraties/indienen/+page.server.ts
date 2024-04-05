import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { declatationSchema } from './declarationSchema';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { env } from '$env/dynamic/private';
import db from '$lib/server/db';
import { getLedgerIds } from '$lib/ongeveer/db';
import { uploadFile } from '$lib/server/mongo';

export const load = (async () => {
	const data = {
		methodOfPayment: 'Eigen rekening',
		receiveMethod: 'SALDO'
	} as const;
	const form = await superValidate(data, declatationSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		try {
			const { request, locals } = event;
			const formData = await request.formData();
			const form = await superValidate(formData, declatationSchema);

			if (!form.valid) return fail(400, { form });
			const receipt = formData.get('receipt') as File;
			const { receiveMethod, product, methodOfPayment, iban, price } = form.data;

			const personData = await db.financialPersonDataUser.findFirst({
				where: {
					userId: locals.user.id
				}
			});

			if (!personData) throw error(500, 'Gebruiker heeft geen financiële gegevens');

			await db.$transaction(async (tx) => {
				const description = `Declaratie: ${product}`;
				// Create object in database
				const declaration = await tx.journal.create({
					data: {
						type: 'DECLARATION',
						date: new Date(),
						termsOfPayment: 14,
						relationId: personData.personId,
						description,
						ref: description,
						Rows: {
							create: [
								{
									amount: 1,
									price,
									ledgerId: (await getLedgerIds()).DEFAULT_DECLARATION_LEDGER,
									description: product
								}
							]
						},
						DeclarationData: {
							create: {
								methodOfPayment,
								status: 'PENDING',
								askedAmount: price,
								receiveMethod,
								iban,
								financialPersonId: personData.personId,
								reason: product
							}
						}
					}
				});

				if (!receipt || receipt?.size === 0) return;

				// Save the receipt
				const meta = await uploadFile(receipt, { quality: 99 });

				await tx.journal.update({
					where: {
						id: declaration.id
					},
					data: {
						Attachments: {
							create: [
								{
									filename: meta.name,
									size: meta.size,
									MIMEtype: meta.type
								}
							]
						}
					}
				});
			});
		} catch (err: any) {
			console.error(err);
			return fail(400, { succes: false, message: err?.message ?? 'Internal Error' });
		}

		throw redirect(
			{ message: 'Je kan er gelijk nog een doen.', title: 'Declaratie ingediend', type: 'success' },
			event
		);
	}
} satisfies Actions;
