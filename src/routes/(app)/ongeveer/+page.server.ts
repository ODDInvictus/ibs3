import prisma from '$lib/server/db'
import Decimal from 'decimal.js'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

async function getTransactions(type: 'BANK' | 'SALDO') {
	return await prisma.transaction.findMany({
		include: {
			TransactionMatchRow: true,
			BankTransaction: true,
			SaldoTransaction: true,
		},
		where: {
			type,
			OR:
				type == 'SALDO'
					? [{ SaldoTransaction: { from: { type: 'INVICTUS' } } }, { SaldoTransaction: { to: { type: 'INVICTUS' } } }]
					: undefined,
		},
	})
}

function getUnmatchedTransactions(transactions: Awaited<ReturnType<typeof getTransactions>>) {
	return transactions.filter(t => {
		const matched = t.TransactionMatchRow.reduce((acc: Decimal, row) => acc.add(row.amount), new Decimal(0))
		const price = t.type === 'BANK' ? t.BankTransaction?.amount : t.SaldoTransaction?.price
		if (price === undefined) throw error(500, 'price is undefined')
		return !matched.eq(price)
	})
}

export const load = (async () => {
	const pendingDeclarations = await prisma.declarationData.findMany({
		where: { status: 'PENDING' },
		include: {
			Journal: true,
		},
	})

	const saldoTransactions = await getTransactions('SALDO')
	const unmatchedSaldoTransactions = getUnmatchedTransactions(saldoTransactions)

	const bankTransactions = await getTransactions('BANK')
	const unmatchedBankTransactions = getUnmatchedTransactions(bankTransactions)

	const purchases = await prisma.journal.findMany({
		where: {
			type: 'PURCHASE',
		},
		include: {
			TransactionMatchRow: true,
			Rows: true,
		},
	})

	const overduePurchases = purchases.filter(purchase => {
		// Check if the total amount of the purchase is equal to the sum of the matched transactions
		const matched = purchase.TransactionMatchRow.reduce((acc: Decimal, row) => acc.add(row.amount), new Decimal(0))
		const total = purchase.Rows.reduce((acc, row) => acc.add(row.price.mul(row.amount)), new Decimal(0))
		if (total.eq(matched)) return false
		// Check if the purchase is overdue
		const dueDate = new Date(purchase.date!.getDate() + purchase.termsOfPayment)
		return dueDate < new Date()
	})

	const bankTransactionsLastUpdated = await prisma.settings.findUnique({
		where: { name: 'bankTransactionsLastUpdated' },
	})

	return {
		pendingDeclarations: JSON.parse(JSON.stringify(pendingDeclarations)) as typeof pendingDeclarations,
		unmatchedSaldoTransactions: JSON.parse(JSON.stringify(unmatchedSaldoTransactions)) as typeof unmatchedSaldoTransactions,
		unmatchedBankTransactions: JSON.parse(JSON.stringify(unmatchedBankTransactions)) as typeof unmatchedBankTransactions,
		overduePurchases: JSON.parse(JSON.stringify(overduePurchases)) as typeof overduePurchases,
		bankTransactionsLastUpdated: bankTransactionsLastUpdated ? new Date(bankTransactionsLastUpdated.value) : null,
	}
}) satisfies PageServerLoad
