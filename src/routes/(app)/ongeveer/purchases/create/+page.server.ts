import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { getInvoiceStatus, getLedgers, getRelations } from '$lib/ongeveer/db';
import schema from './pruchaseSchema';
import { redirect } from 'sveltekit-flash-message/server';
import fs from 'fs';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import { formatFileSize } from '$lib/utils';

type PurchaseType = 'PURCHASE' | 'DECLARATION';

export const load = (async (event) => {
	const id = Number(event.url.searchParams.get('id'));
	let type = event.url.searchParams.get('type') ?? undefined;
	if (type && type !== 'PURCHASE' && type !== 'DECLARATION') type = undefined;

	let purchase = null;
	if (id) {
		purchase = await db.invoice.findUnique({
			where: { id },
			include: {
				Rows: true,
				Attachments: true
			}
		});
		if (!purchase) throw error(404);
		if (purchase.type === 'SALE')
			throw redirect(
				`/ongeveer/sales/${purchase.id}`,
				{
					message: 'Dit is een verkoop factuur',
					type: 'warning',
					title: 'Fout'
				},
				event
			);
	}

	const data = purchase
		? {
				id: purchase.id,
				ref: purchase.ref ?? undefined,
				date: purchase.date ?? undefined,
				termsOfPayment: purchase.termsOfPayment,
				relation: purchase.relationId,
				type: purchase.type as PurchaseType,
				rows: purchase.Rows.map((row) => ({
					amount: row.amount,
					price: row.price.toNumber(),
					description: row.description,
					ledger: row.ledgerId
				}))
		  }
		: {
				rows: [{ amount: 1, price: 0, description: '', ledger: 0 }],
				termsOfPayment: 30,
				type: (type ?? 'PURCHASE') as PurchaseType,
				date: new Date()
		  };

	const form = await superValidate(data, schema);

	console.log(purchase?.Attachments);

	const attachments =
		purchase?.Attachments?.map((attatchment) => {
			return {
				MIMEtype: attatchment.MIMEtype,
				src: `${publicEnv.PUBLIC_UPLOAD_URL}purchases/${attatchment.filename}`,
				size: formatFileSize(attatchment.size),
				name: attatchment.filename
			};
		}) ?? [];

	return {
		form,
		relations: await getRelations(),
		ledgers: await getLedgers(),
		attachments
	};
}) satisfies PageServerLoad;

const createFileNames = (files: File[], id: string | number) => {
	const fileData: { name: string; file: File }[] = [];
	for (const file of files) {
		if (file.type === 'application/octet-stream') continue;
		fileData.push({ name: `purchase-${id}-${file.name.replaceAll(' ', '_')}`, file });
	}
	return fileData;
};

export const actions: Actions = {
	default: async (event) => {
		const { request, locals } = event;

		const formData = await request.formData();
		const form = await superValidate(formData, schema);

		if (!authorization(locals.roles)) throw error(403);
		if (!form.valid) return fail(400, { form });

		const attatchments = formData.getAll('attatchments') as File[];
		const toDelete = JSON.parse(formData.get('toDelete') as string) as string[]; // Filenames to delete, include already uploaded files and files that are not uploaded yet
		const { id, ref, date, termsOfPayment, relation, rows, type } = form.data;

		// TODO make sure declaration can only be related to a user

		if (id) {
			const status = await getInvoiceStatus(id);
			if (!status) throw error(404);

			// TODO make if posible to change irrelevant fields
			if (status === 'PAID')
				throw error(409, {
					message:
						'Deze factuur is al gematched, unmatch de banktransactie voordat je de aankoop kan wijzigen'
				});
		}

		let files: ReturnType<typeof createFileNames> = [];

		try {
			if (id) {
				// Update existing invoice
				files = createFileNames(attatchments, id);
				await db.invoice.update({
					where: { id },
					data: {
						ref,
						date,
						termsOfPayment,
						relationId: relation,
						Attachments: {
							deleteMany: {
								filename: {
									in: toDelete
								}
							},
							create: files
								.filter(({ name }) => !toDelete.includes(name))
								.map((fileData) => {
									return {
										filename: fileData.name,
										MIMEtype: fileData.file.type,
										size: fileData.file.size
									};
								})
						},
						Rows: {
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
			} else {
				// Create new invoice
				const { id } = await db.invoice.create({
					data: {
						type,
						ref,
						date,
						termsOfPayment,
						relationId: relation,
						Rows: {
							create: rows.map(({ amount, price, description, ledger }) => ({
								amount,
								price,
								description,
								ledgerId: ledger
							}))
						}
					}
				});
				files = createFileNames(attatchments, id);
				await db.invoice.update({
					where: { id },
					data: {
						Attachments: {
							create: files
								.filter(({ name }) => !toDelete.includes(name))
								.map((fileData) => ({
									filename: fileData.name,
									MIMEtype: fileData.file.type,
									size: fileData.file.size
								}))
						}
					}
				});
			}
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		// Write files to disk
		// TODO @niels write new endpoint to upload files
		// TODO prevent files from being overwritten / uploading a file twice when updating an existing invoice
		try {
			for (let fileData of files) {
				if (toDelete.includes(fileData.name)) continue;
				fs.writeFileSync(
					`${privateEnv.UPLOAD_FOLDER}/purchases/${fileData.name}`,
					Buffer.from(await fileData.file.arrayBuffer()),
					{ encoding: 'binary' }
				);
			}
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		// Delete files from disk
		// TODO escape toDelete to go up/into another folder
		for (let file of toDelete) {
			if (files.find(({ name }) => name === file)) continue;
			try {
				fs.unlinkSync(`${privateEnv.UPLOAD_FOLDER}/purchases/${file}`);
			} catch (e) {
				console.error(e);
				throw error(500);
			}
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
