import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { zod4 } from 'sveltekit-superforms/adapters'
import { authorization } from '$lib/ongeveer/utils'
import db from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'
import { getJournalStatus, getLedgers, getRelations } from '$lib/ongeveer/db'
import schema from './pruchaseSchema'
import { redirect } from 'sveltekit-flash-message/server'
import { deleteFile, uploadGenericFile } from '$lib/server/files'
import { getPictureUrl } from '$lib/utils'

type PurchaseType = 'PURCHASE' | 'DECLARATION'

export const load = (async event => {
	const id = Number(event.url.searchParams.get('id'))
	let type = event.url.searchParams.get('type') ?? undefined
	if (type && type !== 'PURCHASE' && type !== 'DECLARATION') type = undefined

	let purchase = null
	if (id) {
		purchase = await db.journal.findUnique({
			where: { id },
			include: {
				Rows: {
					include: {
						Ledger: true,
					},
				},
				Attachments: true,
				DeclarationData: true,
			},
		})
		if (!purchase) return error(404)
		if (purchase.type === 'SALE')
			throw redirect(
				`/ongeveer/sales/${purchase.id}`,
				{
					message: 'Dit is een verkoop factuur',
					type: 'warning',
					title: 'Fout',
				},
				event,
			)
	}

	const data = purchase
		? {
				id: purchase.id,
				ref: purchase.ref ?? undefined,
				date: purchase.date ?? undefined,
				termsOfPayment: purchase.termsOfPayment,
				relation: purchase.relationId,
				type: purchase.type as PurchaseType,
				rows: purchase.Rows.map(row => ({
					amount: row.amount,
					price: row.price.toNumber(),
					description: row.description,
					ledger: row.ledgerId,
				})),
			}
		: {
				rows: [{ amount: 1, price: 0, description: '', ledger: 0 }],
				termsOfPayment: 30,
				type: (type ?? 'PURCHASE') as PurchaseType,
				date: new Date(),
			}

	const form = await superValidate(data, zod4(schema))

	const relations = await getRelations()

	const declarationData = purchase?.DeclarationData
		? (JSON.parse(JSON.stringify(purchase.DeclarationData)) as typeof purchase.DeclarationData)
		: null

	const attachments =
		purchase?.Attachments.map(file => {
			return {
				...file,
				src: getPictureUrl(file.filename, 'original'),
				MIMEtype: 'onbekend',
				size: 'onbekend',
			}
		}) ?? []

	let ledgers = await getLedgers()
	for (const row of purchase?.Rows ?? []) {
		if (!ledgers.find(ledger => ledger.id === row.ledgerId)) {
			ledgers.push(row.Ledger)
		}
	}

	return {
		form,
		relations: JSON.parse(JSON.stringify(relations)) as typeof relations,
		ledgers,
		attachments,
		declarationData,
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async event => {
		const { request, locals } = event

		const formData = await request.formData()
		const form = await superValidate(formData, zod4(schema))

		if (!authorization(locals.roles)) return error(403)
		if (!form.valid) return fail(400, { form })

		const files = formData.getAll('attachments') as File[]
		const toDelete = JSON.parse(formData.get('toDelete') as string) as string[] // Filenames to delete, include already uploaded files and files that are not uploaded yet
		const attachments = files.filter(f => !toDelete.includes(f.name) && f.size > 0)
		const { ref, date, termsOfPayment, relation, rows, type } = form.data
		let id = form.data.id

		// TODO make sure declaration can only be related to a user

		if (id) {
			const status = await getJournalStatus(id)
			if (!status) return error(404)

			// TODO make if posible to change irrelevant fields
			if (status === 'PAID')
				return error(409, {
					message: 'Deze factuur is al gematched, unmatch de transactie voordat je de aankoop kan wijzigen',
				})
		}

		// Handle attatchments
		let attachmentIds: Awaited<string>[] = []
		try {
			attachmentIds = await Promise.all(attachments.map(f => uploadGenericFile(f, locals.user)))
			// TODO get fileIDS
			await Promise.all(toDelete.map(name => deleteFile(name)))
		} catch (e) {
			console.error(e)
			return error(500)
		}

		const rowsCreate = rows.map(({ amount, price, description, ledger }) => ({
			amount,
			price,
			description,
			ledgerId: ledger,
		}))

		try {
			if (id) {
				// Update existing journal
				await db.journal.update({
					where: { id },
					data: {
						ref,
						date,
						termsOfPayment,
						relationId: relation,
						Attachments: {
							deleteMany: {
								filename: {
									in: toDelete,
								},
							},
							connect: attachmentIds.map(filename => {
								return { filename }
							}),
						},
						Rows: {
							deleteMany: {},
							create: rowsCreate,
						},
					},
				})
			} else {
				// Create new journal
				const newJournal = await db.journal.create({
					data: {
						type,
						ref,
						date,
						termsOfPayment,
						relationId: relation,
						Rows: {
							create: rowsCreate,
						},
						Attachments: {
							connect: attachmentIds.map(filename => {
								return { filename }
							}),
						},
					},
				})
				id = newJournal.id
			}
		} catch (e) {
			console.error(e)
			return error(500)
		}

		return redirect(
			`/ongeveer/purchases/${id}`,
			{
				message: `Aankoop boeking ${id ? 'aangepast' : 'aangemaakt'}`,
				type: 'success',
				title: 'Succes',
			},
			event,
		)
	},
}
