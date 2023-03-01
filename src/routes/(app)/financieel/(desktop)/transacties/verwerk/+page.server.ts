import type { PageServerLoad } from './$types';
import db from "$lib/server/db";

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

  return {
    transactions,
  };
}) satisfies PageServerLoad;
