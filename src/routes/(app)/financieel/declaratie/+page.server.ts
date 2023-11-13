import db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import fs from 'fs';
import { env } from '$env/dynamic/private';
import schema from './declarationSchema';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const data = {
		methodOfPayment: 'Eigen rekening',
		receiveMethod: 'SALDO' as const
	};
	const form = await superValidate(data, schema);

	return { form };
};

export const actions = {
	default: async (event) => {
		try {
			const { request, locals } = event;
			const formData = await request.formData();
			const form = await superValidate(formData, schema);

			if (!form.valid) return fail(400, { form });
			const receipt = formData.get('receipt') as File;
			const { receiveMethod, product, methodOfPayment, iban, price } = form.data;

			if (receiveMethod === 'BANK' && !iban) return setError(form, 'iban', 'Verplicht');

			const personData = await db.financialPersonDataUser.findFirst({
				where: {
					userId: locals.user.id
				}
			});

			if (!personData) throw error(500, 'Gebruiker heeft geen financiële gegevens');

			await db.$transaction(async (tx) => {
				// Create object in database
				const declaration = await tx.invoice.create({
					data: {
						type: 'DECLARATION',
						date: new Date(),
						termsOfPayment: 14,
						relationId: personData.personId,
						Rows: {
							create: [
								{
									amount: 1,
									price,
									ledgerId: 3100, // TODO fix this
									description: product
								}
							]
						},
						DeclarationData: {
							create: {
								methodOfPayment,
								status: 'PENDING'
							}
						}
					}
				});

				const filename = `receipt-${declaration.id}-${receipt.name}`;

				await tx.invoice.update({
					where: {
						id: declaration.id
					},
					data: {
						Attachments: {
							create: [
								{
									filename,
									size: receipt.size,
									MIMEtype: receipt.type
								}
							]
						}
					}
				});

				// Save the receipt
				// TODO @niels replace with new endpoint
				fs.writeFileSync(
					`${env.UPLOAD_FOLDER}/purchases/${filename}`,
					Buffer.from(await receipt.arrayBuffer()),
					{ encoding: 'binary' }
				);
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
