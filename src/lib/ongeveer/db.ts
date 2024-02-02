import prisma from '$lib/server/db';
import db from '$lib/server/db';
import type { Journal, JournalType, Prisma, PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

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
			TransactionMatchRow: true
		}
	});
	if (!journal) return null;
	if (journal.TransactionMatchRow.length > 0) return 'PAID';
	return 'UNPAID';
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
export async function createTransacton({
	giver,
	receiver,
	amount,
	description
}: {
	giver: number;
	receiver: number;
	amount: number;
	description: string;
}) {
	const transaction = await db.transaction.create();
	return await db.saldoTransaction.create({
		data: {
			fromId: giver,
			toId: receiver,
			price: amount,
			description: 'Handmatige transactie: ' + description,
			transactionId: transaction.id
		}
	});
}
