import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import fs from 'fs';
import { env } from '$env/dynamic/private';

type FormData = {
	product: string;
	methode: string;
	prijs: string;
	statiegeld: string;
	receipt: File;
};

export const actions = {
	default: async (event) => {
		try {
			const data = Object.fromEntries(await event.request.formData()) as unknown as FormData;

			// save declaration
			if (!data.product) throw new Error('Product is verplicht');
			if (!data.methode) throw new Error('Methode is verplicht');
			if (!data.prijs || parseFloat(data.prijs) < 0.01) throw new Error('Prijs is verplicht');
			if (!data.statiegeld || parseFloat(data.statiegeld) < 0)
				throw new Error('Statiegeld is verplicht of onder 0');
			if (!data.receipt) throw new Error('Bonnetje is verplicht');

			const prijs = parseFloat(data.prijs);
			const statiegeld = parseFloat(data.statiegeld);

			const user = event.locals.user;

			const personData = await db.financialPersonDataUser.findFirst({
				where: {
					userId: user.id
				}
			});

			if (!personData) throw new Error('Geen persoonsgegevens gevonden');

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
									price: prijs,
									ledgerId: 3100, // TODO fix this
									description: data.product
								},
								{
									amount: 1,
									price: statiegeld,
									ledgerId: 3100, // TODO fix this
									description: 'Statiegeld'
								}
							]
						},
						DeclarationData: {
							create: {
								methodOfPayment: data.methode,
								status: 'PENDING'
							}
						}
					}
				});

				const filename = `receipt-${declaration.id}-${data.receipt.name}`;

				await tx.invoice.update({
					where: {
						id: declaration.id
					},
					data: {
						Attachments: {
							create: [
								{
									filename,
									size: data.receipt.size,
									MIMEtype: data.receipt.type
								}
							]
						}
					}
				});

				// Save the receipt
				// TODO @niels replace with new endpoint
				fs.writeFileSync(
					`${env.UPLOAD_FOLDER}/purchases/${filename}`,
					Buffer.from(await data.receipt.arrayBuffer()),
					{ encoding: 'binary' }
				);
			});

			return {
				success: true,
				message: 'Declaratie is opgeslagen. Je kan gelijk nog een declaratie doen!'
			};
		} catch (err: any) {
			console.error(err);
			return fail(400, { succes: false, message: err?.message ?? 'Internal Error' });
		}
	}
} satisfies Actions;
