import db from '$lib/server/db';
import type { Journal, JournalType } from '@prisma/client';

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
			BankTransactionMatchRow: true
		}
	});
	if (!journal) return null;
	if (journal.BankTransactionMatchRow) return 'PAID';
	return 'UNPAID';
};
