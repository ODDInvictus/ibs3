import { error, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { matchSaldoTransaction } from './matchSaldoTransaction'
import { superValidate } from 'sveltekit-superforms/server'
import { authorization } from '$lib/ongeveer/utils'
import Decimal from 'decimal.js'
import { redirect } from 'sveltekit-flash-message/server'
import { getInvictusId, getUnmatchedJournals } from '$lib/ongeveer/db'
import type { Notification } from '$lib/notification'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(400)

	const transaction = await db.saldoTransaction.findUnique({
		where: { id },
		include: {
			Transaction: {
				include: {
					TransactionMatchRow: true,
				},
			},
			TransactionMatchRow: true,
		},
	})

	if (!transaction) throw error(404)

	const data = {
		rows: transaction.Transaction.TransactionMatchRow.map(r => {
			if (!r.journalId) {
				throw error(500, 'JournalId is missing, while a saldo transaction should always be matched to a journal')
			}
			return {
				description: r.description ?? undefined,
				amount: r.amount.toNumber(),
				journal: r.journalId,
			}
		}),
	}
	const form = await superValidate(data, matchSaldoTransaction)

	const journals = await getUnmatchedJournals()

	return {
		transaction: JSON.parse(JSON.stringify(transaction)) as typeof transaction,
		journals,
		form,
	}
}) satisfies PageServerLoad

export const actions = {
	default: async event => {
		const { request, locals, params } = event
		const id = Number(params.id)
		if (Number.isNaN(id)) throw error(400)

		const form = await superValidate(request, matchSaldoTransaction)

		if (!authorization(locals.roles)) return fail(403, { form })
		if (!form.valid) return fail(400, { form })

		const saldoTransaction = await db.saldoTransaction.findUnique({
			where: { id },
			include: {
				Transaction: true,
				TransactionMatchRow: true,
			},
		})
		if (!saldoTransaction) return fail(404, { form, message: 'Saldo transaction not found' })

		const invictusId = await getInvictusId()

		let type: 'sale' | 'purchase'
		if (saldoTransaction.toId === invictusId) {
			type = 'sale'
		} else if (saldoTransaction.fromId === invictusId) {
			type = 'purchase'
		} else {
			return fail(400, {
				form,
				message: 'Je kan alleen een transactie van of naar Invictus matchen.',
			})
		}

		let warning: Notification | undefined

		// Match niet meer dan waarde van transactie
		const fromBank = saldoTransaction.TransactionMatchRow?.amount ?? 0
		const total = form.data.rows.reduce((acc, row) => acc.add(new Decimal(row.amount)), new Decimal(0)).add(fromBank)
		if (total.gt(saldoTransaction.price)) {
			return fail(400, {
				form,
				message: `Total amount of matched rows (${total}) exceeds saldo transaction amount (${saldoTransaction.price})`,
			})
		}

		if (total.lt(saldoTransaction.price)) {
			warning = {
				title: 'Warning',
				message: `Totaal gematcht (${total}) is minder dan de waarde van de transactie (${saldoTransaction.price})`,
				type: 'warning',
			}
		}

		// Check if is matched more to a journal then allowed
		for (let i = 0; i < form.data.rows.length; i++) {
			const journal = await db.journal.findUnique({
				where: { id: form.data.rows[i].journal },
				include: {
					TransactionMatchRow: true,
					Rows: true,
				},
			})

			if (!journal) {
				return fail(400, {
					form,
					message: `Journal with id ${form.data.rows[i].journal} not found`,
				})
			}

			// Invert the matched amount if the transaction is of another type then the journal
			const multiplier =
				(type === 'sale' && journal.type === 'SALE') ||
				(type === 'purchase' && (journal.type === 'PURCHASE' || journal.type === 'DECLARATION'))
					? 1
					: -1
			form.data.rows[i].amount *= multiplier

			// Already matched amount
			const matched = journal.TransactionMatchRow.reduce((acc, row) => {
				// Do not include the current transaction
				if (row.transactionId === saldoTransaction.Transaction.id) {
					return acc
				}
				return acc.add(new Decimal(row.amount))
			}, new Decimal(0))

			// Max amount to match
			const journalTotal = journal.Rows.reduce((acc, row) => acc.add(row.price.mul(row.amount)), new Decimal(0))

			// Max amount remaining to match
			const toPay = journalTotal.sub(matched)

			if (toPay.gt(form.data.rows[i].amount)) {
				return fail(400, {
					form,
					message: `Boekstuk #${form.data.rows[i].journal} heeft een totaal van EUR ${journalTotal} and EUR ${matched} al gematcht. Je kan dus maar EUR ${toPay} matchen.`,
				})
			}
		}

		/* Validations passed */

		// Delete all matches with this transaction
		await db.transactionMatchRow.deleteMany({
			where: { transactionId: saldoTransaction.Transaction.id },
		})

		// Create new matches
		await db.transactionMatchRow.createMany({
			data: form.data.rows.map(row => ({
				transactionId: saldoTransaction.Transaction.id,
				journalId: row.journal,
				amount: row.amount,
				description: row.description,
			})),
		})

		// Win and redirect
		throw redirect(
			`/ongeveer/saldo/transactions/${id}`,
			warning ?? {
				title: 'Matched',
				message: 'De transactie is succesvol gematcht',
				type: 'success',
			},
			event,
		)
	},
}
