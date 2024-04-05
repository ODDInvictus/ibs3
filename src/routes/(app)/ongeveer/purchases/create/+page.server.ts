import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { authorization } from '$lib/ongeveer/utils'
import db from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'
import { getJournalStatus, getLedgers, getRelations } from '$lib/ongeveer/db'
import schema from './pruchaseSchema'
import { redirect } from 'sveltekit-flash-message/server'
import { formatFileSize } from '$lib/utils'
import { deleteFile, uploadFile } from '$lib/server/mongo'

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
				Rows: true,
				Attachments: true,
				DeclarationData: true,
			},
		})
		if (!purchase) throw error(404)
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

	const form = await superValidate(data, schema)

	const attachments =
		purchase?.Attachments?.map(attatchment => {
			return {
				MIMEtype: attatchment.MIMEtype,
				size: formatFileSize(attatchment.size),
				filename: attatchment.filename,
			}
		}) ?? []

	const relations = await getRelations()

	const declarationData = purchase?.DeclarationData
		? (JSON.parse(JSON.stringify(purchase.DeclarationData)) as typeof purchase.DeclarationData)
		: null

	return {
		form,
		relations: JSON.parse(JSON.stringify(relations)) as typeof relations,
		ledgers: await getLedgers(),
		attachments,
		declarationData,
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async event => {
		const { request, locals } = event

		const formData = await request.formData()
		const form = await superValidate(formData, schema)

		if (!authorization(locals.roles)) throw error(403)
		if (!form.valid) return fail(400, { form })

		const files = formData.getAll('attachments') as File[]
		const toDelete = JSON.parse(formData.get('toDelete') as string) as string[] // Filenames to delete, include already uploaded files and files that are not uploaded yet
		const attachments = files.filter(f => !toDelete.includes(f.name) && f.size > 0)
		const { ref, date, termsOfPayment, relation, rows, type } = form.data
		let id = form.data.id

		// TODO make sure declaration can only be related to a user

		if (id) {
			const status = await getJournalStatus(id)
			if (!status) throw error(404)

			// TODO make if posible to change irrelevant fields
			if (status === 'PAID')
				throw error(409, {
					message: 'Deze factuur is al gematched, unmatch de transactie voordat je de aankoop kan wijzigen',
				})
		}

		// Handle attatchments
		let attachmentsMeta: Awaited<ReturnType<typeof uploadFile>>[] = []
		try {
			attachmentsMeta = await Promise.all(attachments.map(f => uploadFile(f)))
			await Promise.all(toDelete.map(name => deleteFile(name)))
		} catch (e) {
			console.error(e)
			throw error(500)
		}

		const attachmentsWithNames = attachments.map((file, index) => {
			return {
				meta: attachmentsMeta[index],
				file,
			}
		})

		const attatchmentCreate = attachmentsWithNames.map(({ meta }) => {
			return {
				filename: meta.filename,
				MIMEtype: meta.type,
				size: meta.size,
			}
		})

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
							create: attatchmentCreate,
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
							create: attatchmentCreate,
						},
					},
				})
				id = newJournal.id
			}
		} catch (e) {
			console.error(e)
			throw error(500)
		}

		throw redirect(
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
