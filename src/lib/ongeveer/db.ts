import prisma from '$lib/server/db'
import db from '$lib/server/db'
import type { JournalType } from '@prisma/client'
import Decimal from 'decimal.js'

/**
 * Retrieves journals from the database based on the specified type.
 * If no type is provided, all journals are returned.
 * @param type - The type of journals to retrieve. Can be a single type or an array of types.
 * @returns An array of journals with additional calculated properties for total and paid amounts.
 */
export const getJournals = async ({
	type,
	pagination,
	open,
}: {
	type?: JournalType | JournalType[]
	pagination?: { p: number; size: number }
	open?: boolean
}) => {
	const journals = await db.journal.findMany({
		where: {
			type: type ? (Array.isArray(type) ? { in: type } : type) : undefined,
		},
		include: {
			Rows: {
				select: {
					amount: true,
					price: true,
				},
			},
			relation: {
				select: {
					name: true,
				},
			},
			TransactionMatchRow: {
				select: {
					amount: true,
				},
			},
		},
		orderBy: { date: { sort: 'desc', nulls: 'first' } },
		take: open ? undefined : pagination?.size,
		skip: open ? undefined : pagination ? pagination.p * pagination.size : undefined,
	})

	let journalsWithTotal = journals.map(journal => {
		const total = journal.Rows.reduce((acc, row) => acc.add(row.price.mul(row.amount)), new Decimal(0))
		const paid = journal.TransactionMatchRow.reduce((acc, row) => acc.add(row.amount), new Decimal(0))

		return {
			...journal,
			total: total.toNumber(),
			paid: paid.toNumber(),
		}
	})

	if (open) {
		journalsWithTotal = journalsWithTotal.filter(journal => journal.total !== journal.paid)
		if (pagination) {
			journalsWithTotal = journalsWithTotal.slice(pagination.p * pagination.size, (pagination.p + 1) * pagination.size)
		}
	}

	return JSON.parse(JSON.stringify(journalsWithTotal)) as typeof journalsWithTotal
}

export const getRelations = async () => {
	return await db.financialPerson.findMany({
		where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true },
	})
}

export const getLedgers = async () => {
	return await db.ledger.findMany({ where: { isActive: true } })
}

export const getJournalStatus = async (id: number) => {
	const journal = await db.journal.findUnique({
		where: { id },
		include: {
			TransactionMatchRow: true,
			Rows: true,
		},
	})
	if (!journal) return null

	const total = journal.Rows.reduce((acc, row) => acc.add(row.price.mul(row.amount)), new Decimal(0))
	const paid = journal.TransactionMatchRow.reduce((acc, row) => acc.add(row.amount), new Decimal(0))

	return total.eq(paid) ? 'PAID' : 'UNPAID'
}

/**
 * Applies a transaction by incrementing the balance of the receiver and decrementing the balance of the sender.
 * ID's are the ID's of the User, not Financial person.
 */
export async function applyTransaction({ fromId, toId, price }: { fromId: number; toId: number; price: number }) {
	return await prisma.$transaction(async tx => {
		// Increment the balance of the receiver
		await incrementBalance(toId, price)
		// Decrement the balance of the sender
		await incrementBalance(fromId, -price)

		async function incrementBalance(userId: number, price: number) {
			const fp = await tx.financialPerson.findUnique({
				where: {
					id: userId,
				},
			})
			if (!fp) throw new Error('FinancialPerson not found')
			if (fp.type === 'USER' || fp.type === 'INVICTUS') {
				await tx.financialPerson.update({
					where: {
						id: fp.id,
					},
					data: {
						balance: {
							increment: price,
						},
					},
				})
			} else {
				// TODO Add support for committee
				throw new Error('Committee / others not supported yet')
			}
		}
	})
}

/*
 * Creates a saldo transaction in the database. The balance is automatically changes. ID's are financial person ID's
 */
export async function createTransaction({
	giver,
	receiver,
	amount,
	description,
	isManual,
}: {
	giver: number
	receiver: number
	amount: number | Decimal
	description: string
	isManual?: boolean
}) {
	const transaction = await db.transaction.create()
	return await db.saldoTransaction.create({
		data: {
			fromId: giver,
			toId: receiver,
			price: amount,
			description: `${isManual ?? true ? 'Handmatige transactie: ' : ''}${description}`,
			transactionId: transaction.id,
		},
		include: {
			Transaction: true,
		},
	})
}

/**
 * Check is streeplijst is already processed.
 * This means that every journal is fully paid.
 */
export async function tallySheetIsProcessed(streeplijstId: number) {
	const journals = await db.journal.findMany({
		where: { streeplijstId },
		include: {
			TransactionMatchRow: true,
			Rows: true,
		},
	})
	for (const journal of journals) {
		if ((await getJournalStatus(journal.id)) === 'UNPAID') return false
	}
	return true
}

/**
 * Retrieves the Invictus financial person ID from the database.
 * @returns The Invictus financial person ID.
 * @throws An error if the Invictus financial person is not found.
 */
export async function getInvictusId() {
	const id = (await db.financialPerson.findFirst({ where: { type: 'INVICTUS' } }))?.id
	if (!id) throw new Error('[ONGEVEER] Invictus financial person not found')
	return id
}

/**
 * Retrieves the default ledger IDs from the database.
 * @returns A record containing the ledger names as keys and their corresponding IDs as values.
 * @throws Error if not all ledger IDs are found.
 */
export async function getLedgerIds() {
	const names = ['DEFAULT_DECLARATION_LEDGER', 'DEFAULT_SALE_BEER_LEDGER', 'DEFAULT_SALE_FOOD_LEDGER', 'DEFAULT_SALE_OTHER_LEDGER'] as const

	const ids = await db.settings.findMany({
		where: {
			name: {
				in: [...names],
			},
		},
		select: {
			name: true,
			value: true,
		},
	})
	if (ids.length !== names.length) throw new Error('Not all ledger ids are found')

	const res: Record<string, number> = {}
	for (const name of names) {
		res[name] = Number(ids.find(id => id.name === name)!.value)
	}
	return res as Record<(typeof names)[number], number>
}

/**
 * Retrieves a list of unmatched journals.
 *
 * @returns {Promise<Array<{ id: number, ref: string, type: string }>>} The list of unmatched journals, containing their id, ref, and type.
 */
export async function getUnmatchedJournals() {
	let journals = await db.journal.findMany({
		where: {
			NOT: {
				date: null,
			},
		},
		include: {
			TransactionMatchRow: true,
			Rows: true,
		},
		orderBy: {
			date: 'desc',
		},
	})
	// Filter out journals that are already matched
	journals = journals.filter(journal => {
		const total = journal.Rows.reduce((acc, row) => acc.add(row.price.mul(row.amount)), new Decimal(0))
		const matched = journal.TransactionMatchRow.reduce((acc, row) => acc.add(row.amount), new Decimal(0))
		return !total.eq(matched)
	})

	return journals.map(({ id, ref, type }) => {
		return { id, ref, type }
	})
}
