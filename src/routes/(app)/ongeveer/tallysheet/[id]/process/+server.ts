import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { authorization } from '$lib/ongeveer/utils'
import db from '$lib/server/db'
import Decimal from 'decimal.js'
import { redirect } from 'sveltekit-flash-message/server'
import { getInvictusId } from '$lib/ongeveer/db'

export const GET: RequestHandler = async event => {
	const { locals, params } = event

	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(400)

	if (!authorization(locals.roles)) throw error(403)

	db.$transaction(async tx => {
		// Find all journals that are not fully paid
		const journals = await tx.journal.findMany({
			where: {
				streeplijstId: id,
			},
			include: {
				TransactionMatchRow: true,
				Rows: true,
			},
		})

		const unpaidJournals = journals.reduce((acc, journal) => {
			const total = journal.Rows.reduce((acc, { price, amount }) => acc.add(price.mul(amount)), new Decimal(0))
			const paid = journal.TransactionMatchRow.reduce((acc, { amount }) => acc.add(amount), new Decimal(0))
			if (paid.lessThan(total)) {
				acc.push({
					toPay: total.minus(paid),
					journal,
				})
			}
			return acc
		}, [] as { toPay: Decimal; journal: (typeof journals)[0] }[])

		// Find all journals that not have a date set
		const journalsWithoutDate = journals.filter(journal => !journal.date)

		// Set date to now
		await tx.journal.updateMany({
			where: {
				id: {
					in: journalsWithoutDate.map(journal => journal.id),
				},
			},
			data: {
				date: new Date(),
			},
		})

		// Create transactions to pay the journals
		try {
			await Promise.all(
				unpaidJournals.map(async ({ toPay, journal }) => {
					const description = `Consumpties streeplijst #${journal.streeplijstId}`

					const transaction = await tx.saldoTransaction.create({
						data: {
							Transaction: {
								create: {
									type: 'SALDO',
								},
							},
							price: toPay,
							description,
							from: {
								connect: {
									id: journal.relationId,
								},
							},
							to: {
								connect: {
									id: await getInvictusId(),
								},
							},
						},
						select: {
							price: true,
							Transaction: {
								select: {
									id: true,
								},
							},
						},
					})

					return tx.transactionMatchRow.create({
						data: {
							journalId: journal.id,
							transactionId: transaction.Transaction.id,
							amount: transaction.price,
							description,
						},
					})
				}),
			)
		} catch (e) {
			console.error(e)
			throw error(500, 'Streeplijst kon niet verwerkt worden')
		}
	})

	throw redirect(
		`/ongeveer/tallysheet`,
		{
			message: 'Streeplijst verwerkt',
			title: 'Success',
			type: 'success',
		},
		event,
	)
}
