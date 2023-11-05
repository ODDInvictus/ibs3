import db from '$lib/server/db';
import type { Invoice, InvoiceType } from '@prisma/client';

type InvoiceResponse = Invoice & {
	total: string;
	relation: string;
};

export const getInvoices = async (type: InvoiceType) => {
	const invoices = await db.$queryRaw`
  SELECT i.*, SUM(r.amount * r.price) AS total, p.name AS relation
  FROM Invoice AS i, InvoiceRow AS r, FinancialPerson as p
  WHERE i.type = ${type}
  AND r.invoiceId = i.id
  AND i.relationId = p.id
  GROUP BY i.id
`;
	return JSON.parse(JSON.stringify(invoices)) as InvoiceResponse[];
};

export const getRelations = async () => {
	return await db.financialPerson.findMany({
		where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true }
	});
};

export const getLedgers = async () => {
	return await db.ledger.findMany({ where: { isActive: true } });
};

export const getInvoiceStatus = async (id: number) => {
	const invoice = await db.invoice.findUnique({
		where: { id },
		include: {
			BankTransactionMatchRow: true
		}
	});
	if (!invoice) return null;
	if (invoice.BankTransactionMatchRow) return 'PAID';
	return 'UNPAID';
};
