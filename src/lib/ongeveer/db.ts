import prisma from '$lib/server/db';
import db from '$lib/server/db';
import type { Journal, JournalType } from '@prisma/client';
import Decimal from 'decimal.js';

type JournalResponse = Journal & {
	total: string;
	relation: string;
};

export const getJournals = async (type: JournalType) => {
	const journals = await db.$queryRaw`
  SELECT i.*, SUM(r.amount * r.price) AS total, p.name AS relation
  FROM Journal AS i, JournalRow AS r, FinancialPerson as p
  WHERE i.type = ${type}
  AND r.journalId = i.id
  AND i.relationId = p.id
  GROUP BY i.id
`;
	return JSON.parse(JSON.stringify(journals)) as JournalResponse[];
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
			} else if (fp.type === 'COMMITTEE') {
				// TODO Add support for committee
				throw new Error('Committee not supported yet');
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
