import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async () => {
  const transactions = await db.transaction.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      from: true,
      to: true,
    }
  })

  const sales = await db.sale.findMany({
    include: {
      product: true,
      person: true,
    }
  })

  return {
    transactions,
    sales,
  };
}) satisfies PageServerLoad;
