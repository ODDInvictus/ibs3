import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'
import { matchTransactionSchema } from './matchTransaction'
import { redirect } from 'sveltekit-flash-message/server'
import type { Actions } from './$types'
import { authorization } from '$lib/ongeveer/utils'
import { error, fail } from '@sveltejs/kit'
import db from '$lib/server/db'
import Decimal from 'decimal.js'
import { getJournal } from '../../sales/[id]/getJournal'
import { createTransaction, getInvictusId, getUnmatchedJournals } from '$lib/ongeveer/db'
import { zod4 } from 'sveltekit-superforms/adapters'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (!id) return error(400)

	const bankTransaction = await db.bankTransaction.findUnique({
		where: { id },
		include: {
			Transaction: {
				include: {
					TransactionMatchRow: {
						include: {
							Journal: true,
							SaldoTransaction: true,
						},
					},
				},
			},
			Relation: true,
		},
	})

	if (!bankTransaction) return error(404)

	const data = {
		ref: bankTransaction.ref ?? undefined,
		id: bankTransaction.id,
		relation: bankTransaction.relationId ?? undefined,
		rows: bankTransaction.Transaction.TransactionMatchRow.map(r => {
			return {
				description: r.description ?? undefined,
				amount: r.amount.toNumber(),
				journal: r.journalId ?? undefined,
				saldo: r.saldoTransactionId ? true : false,
			}
		}),
	}

	const form = await superValidate(data, zod4(matchTransactionSchema))

	const financialPersons = await db.financialPerson.findMany({
		select: {
			id: true,
			name: true,
		},
		where: {
			isActive: true,
			// TODO: Add support for groups
			type: {
				in: ['USER', 'OTHER'],
			},
		},
	})

	const journals = await getUnmatchedJournals()

	// Add the matched journals to the list of journals
	for (const row of bankTransaction.Transaction.TransactionMatchRow) {
		if (journals.some(j => j.id === row.journalId)) continue
		if (!row.Journal) continue
		journals.push({
			id: row.Journal.id,
			ref: row.Journal.ref,
			type: row.Journal.type,
		})
	}

	return {
		form,
		financialPersons,
		journals,
		bankTransaction: JSON.parse(JSON.stringify(bankTransaction)) as typeof bankTransaction,
	}
}) satisfies PageServerLoad

export const actions = {
	default: async event => {
		const { request, locals } = event
		let warning: string | null = null

		/* Validations **/

		const form = await superValidate(request, zod4(matchTransactionSchema))
		if (!authorization(locals.roles)) return fail(403, { form })
		if (!form.valid) return fail(400, { form })

		// Query bankTransaction from database
		const bankTransaction = await db.bankTransaction.findUnique({
			where: { id: form.data.id },
			include: {
				Transaction: {
					include: {
						TransactionMatchRow: true,
					},
				},
			},
		})
		if (!bankTransaction) return fail(404, { form })

		// Check if there was already a saldo transaction created, if so throw an error
		if (bankTransaction.Transaction.TransactionMatchRow.some(r => r.saldoTransactionId)) {
			return fail(400, {
				...form,
				message:
					'Je kan deze banktransactie niet meer veranderen, omdat er bij deze transactie saldo is toegevoegd of afgehaald. Maak een handmatige transactie om dit op te lossen.',
			})
		}

		// Check the matched amount
		const matchedAmount = form.data.rows.reduce((acc, row) => {
			return acc.add(row.amount)
		}, new Decimal(0))

		if (matchedAmount.greaterThan(bankTransaction.amount.abs())) {
			return fail(400, {
				message: 'Het gematchte bedrag is groter dan de banktransactie',
			})
		} else if (matchedAmount.lessThan(bankTransaction.amount.abs())) {
			warning = 'Het gematchte bedrag is kleiner dan de banktransactie'
		}

		// Check if is matched more to a journal then allowed
		for (const [i, row] of form.data.rows.entries()) {
			if (!row.journal) continue
			const { journal, toPay } = await getJournal(row.journal)
			if (!journal) return fail(404, form)
			if (toPay < row.amount) {
				return fail(400, {
					form: {
						...form,
						errors: {
							rows: {
								[i]: {
									journal: 'true',
								},
							},
						},
					},
					message: `Je kan niet meer matchen dan openstaat op boekstuk ${journal.id} - ${journal.ref}`,
				})
			}
		}

		/* Validations passed **/

		// Reset mathch rows
		await db.transactionMatchRow.deleteMany({
			where: { transactionId: bankTransaction.transactionId },
		})

		// Create and match saldotransactions
		for (const row of form.data.rows) {
			if (!row.saldo) continue
			if (!form.data.relation) {
				return fail(400, { ...form, message: 'Relatie is verplicht als je saldo wilt toevoegen' })
			}
			const saldoTransaction = await createTransaction({
				giver: await getInvictusId(),
				receiver: form.data.relation,
				amount: row.amount,
				description: `Transactie vanuit banktransactie #${bankTransaction.id}: ${row.description}`,
			})
			await db.transactionMatchRow.create({
				data: {
					transactionId: bankTransaction.transactionId,
					saldoTransactionId: saldoTransaction.id,
					amount: row.amount,
				},
			})
		}

		await Promise.all([
			// Match journals
			...form.data.rows.map(row => {
				if (!row.journal) return Promise.resolve(null)
				return db.transactionMatchRow.create({
					data: {
						transactionId: bankTransaction.transactionId,
						journalId: row.journal,
						amount: row.amount,
						description: row.description,
					},
				})
			}),
			// Update banktransaction data
			db.bankTransaction.update({
				where: { id: form.data.id },
				data: {
					relationId: form.data.relation,
					ref: form.data.ref,
				},
			}),
		])

		const flashMessage = warning
			? ({
					message: warning,
					type: 'warning',
					title: 'Waarschuwing',
				} as const)
			: ({
					message: 'Transactie gematcht',
					type: 'success',
					title: 'Succes',
				} as const)

		throw redirect('/ongeveer/bank', flashMessage, event)
	},
} satisfies Actions
