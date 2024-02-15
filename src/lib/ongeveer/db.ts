import prisma from '$lib/server/db';
import db from '$lib/server/db';
import type { JournalType } from '@prisma/client';
import Decimal from 'decimal.js';

/**
 * Retrieves journals from the database based on the specified type.
 * If no type is provided, all journals are returned.
 * @param type - The type of journals to retrieve. Can be a single type or an array of types.
 * @returns An array of journals with additional calculated properties for total and paid amounts.
 */
export const getJournals = async ({
	type,
	pagination
}: {
	type?: JournalType | JournalType[];
	pagination?: { p: number; size: number };
}) => {
	const journals = await db.journal.findMany({
		where: {
			type: type ? (Array.isArray(type) ? { in: type } : type) : undefined
		},
		include: {
			Rows: {
				select: {
					amount: true,
					price: true
				}
			},
			relation: {
				select: {
					name: true
				}
			},
			TransactionMatchRow: {
				select: {
					amount: true
				}
			}
		},
		orderBy: { date: { sort: 'desc', nulls: 'first' } },
		take: pagination?.size,
		skip: pagination ? pagination.p * pagination.size : undefined
	});

	const journalsWithTotal = journals.map((journal) => {
		const total = journal.Rows.reduce(
			(acc, row) => acc.add(row.price.mul(row.amount)),
			new Decimal(0)
		);
		const paid = journal.TransactionMatchRow.reduce(
			(acc, row) => acc.add(row.amount),
			new Decimal(0)
		);

		return {
			...journal,
			total: total.toNumber(),
			paid: paid.toNumber()
		};
	});

	return JSON.parse(JSON.stringify(journalsWithTotal)) as typeof journalsWithTotal;
};

export const getRelations = async () => {
	return await db.financialPerson.findMany({
		where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true }
	});
};

export const getLedgers = async () => {
	return await db.ledger.findMany({ where: { isActive: true } });
};

export const getJournalStatus = async (id: number) => {
	const journal = await db.journal.findUnique({
		where: { id },
		include: {
			TransactionMatchRow: true,
			Rows: true
		}
	});
	if (!journal) return null;

	const total = journal.Rows.reduce(
		(acc, row) => acc.add(row.price.mul(row.amount)),
		new Decimal(0)
	);
	const paid = journal.TransactionMatchRow.reduce(
		(acc, row) => acc.add(row.amount),
		new Decimal(0)
	);

	return total.lessThanOrEqualTo(paid) ? 'PAID' : 'UNPAID';
};

/**
 * Applies a transaction by incrementing the balance of the receiver and decrementing the balance of the sender.
 * ID's are the ID's of the User, not Financial person.
 */
export async function applyTransaction({
	fromId,
	toId,
	price
}: {
	fromId: number;
	toId: number;
	price: number;
}) {
	return await prisma.$transaction(async (tx) => {
		// Increment the balance of the receiver
		await incrementBalance(toId, price);
		// Decrement the balance of the sender
		await incrementBalance(fromId, -price);

		async function incrementBalance(userId: number, price: number) {
			const fp = await tx.financialPerson.findUnique({
				where: {
					id: userId
				}
			});
			if (!fp) throw new Error('FinancialPerson not found');
			if (fp.type === 'USER' || fp.type === 'INVICTUS') {
				await tx.financialPerson.update({
					where: {
						id: fp.id
					},
					data: {
						balance: {
							increment: price
						}
					}
				});
			} else {
				// TODO Add support for committee
				throw new Error('Committee / others not supported yet');
			}
		}
	});
}

/*
 * Creates a saldo transaction in the database. The balance is automatically changes. ID's are user ID's, not financial person ID's
 */
export async function createTransaction({
	giver,
	receiver,
	amount,
	description,
	isManual
}: {
	giver: number;
	receiver: number;
	amount: number | Decimal;
	description: string;
	isManual?: boolean;
}) {
	const transaction = await db.transaction.create();
	return await db.saldoTransaction.create({
		data: {
			fromId: giver,
			toId: receiver,
			price: amount,
			description: `${isManual ?? true ? 'Handmatige transactie: ' : ''}${description}`,
			transactionId: transaction.id
		},
		include: {
			Transaction: true
		}
	});
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
			Rows: true
		}
	});
	for (const journal of journals) {
		if ((await getJournalStatus(journal.id)) === 'UNPAID') return false;
	}
	return true;
}
