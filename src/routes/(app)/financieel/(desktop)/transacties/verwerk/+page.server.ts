import type { PageServerLoad } from './$types';
import db from "$lib/server/db";

type SummaryItem = {
  from: string;
  to: string;
  totalAmount: number;
}

export const load = (async () => {
  const transactions = await db.transaction.findMany({
    where: {
      settled: false
    },
    include: {
      from: true,
      to: true,
      ledger: true,
    }
  })

  const summary: SummaryItem[] = [];

  for (const transaction of transactions) {
    const from = transaction.from.name;
    const to = transaction.to.name;
    const totalAmount = transaction.price;

    const existing = summary.find(item => item.from === from && item.to === to);

    if (existing) {
      existing.totalAmount += totalAmount;
    } else {
      summary.push({
        from,
        to,
        totalAmount,
      });
    }
  }

  return {
    transactions,
    summary
  };
}) satisfies PageServerLoad;
