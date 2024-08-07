import db from '$lib/server/db'
import { error, type Actions } from '@sveltejs/kit'
import { isFinancie } from '$lib/server/auth'
import type { BankTransactionProduct, BankTransactionType } from '@prisma/client'

const HEADERS = ['Type', 'Product', 'Started Date', 'Completed Date', 'Description', 'Amount', 'Fee'] as const

export const actions = {
	default: async ({ request, locals }) => {
		if (!isFinancie(locals.user)) return error(403)

		const formData = await request.formData()
		const file = formData.get('file') as File
		const lines = (await file.text()).split('\n')
		const keys = lines.shift()?.split(',') ?? []
		if (!HEADERS.every(header => keys.includes(header))) return error(400, 'Bestand ongeldig')
		const transactions: { [key: string]: string }[] = []
		for (const row of lines) {
			if (row === '') continue // skip empty lines (last line)
			const transaction: { [key: string]: string } = {}
			const values = row.split(',')
			for (let i = 0; i < keys.length; i++) {
				if (!(HEADERS as readonly string[]).includes(keys[i])) continue // skip unknown headers
				if (values[i] === undefined) return error(400, 'Bestand ongeldig')
				transaction[keys[i]] = values[i]
			}
			transactions.push(transaction)
		}

		try {
			await Promise.all(
				transactions.map(transaction => {
					const data = {
						type: transaction.Type as BankTransactionType,
						product: transaction.Product as BankTransactionProduct,
						startedDate: new Date(transaction['Started Date']).toISOString(),
						completedDate: new Date(transaction['Completed Date']).toISOString(),
						description: transaction.Description,
						amount: transaction.Amount,
						fee: transaction.Fee,
					}

					return db.bankTransaction.upsert({
						where: {
							type_product_startedDate_completedDate_description_amount_fee: data,
						},
						create: {
							...data,
							Transaction: {
								create: {
									type: 'BANK',
								},
							},
						},
						update: {},
					})
				}),
			)
		} catch (e) {
			console.error(e)
			return error(500)
		}

		await db.settings.upsert({
			where: { name: 'bankTransactionsLastUpdated' },
			create: { name: 'bankTransactionsLastUpdated', value: new Date().toISOString(), description: 'Last updated bank transactions' },
			update: { value: new Date().toISOString() },
		})

		return { status: 200 }
	},
} satisfies Actions
