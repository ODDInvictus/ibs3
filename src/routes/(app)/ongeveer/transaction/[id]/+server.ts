import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import db from '$lib/server/db'

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) throw error(400)

	const transaction = await db.transaction.findUnique({
		where: { id },
		include: { SaldoTransaction: true, BankTransaction: true },
	})
	if (!transaction) throw error(404)

	if (transaction.type === 'BANK' && transaction.BankTransaction) {
		throw redirect(303, `/ongeveer/bank/${transaction.BankTransaction.id}`)
	}
	if (transaction.type === 'SALDO' && transaction.SaldoTransaction) {
		throw redirect(303, `/ongeveer/saldo/transactions/${transaction.SaldoTransaction.id}`)
	}

	throw error(500)
}
