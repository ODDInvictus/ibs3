import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";
import type { Actions } from '@sveltejs/kit';

export const load = (async () => {
  const sales = await db.sale.findMany({
    include: {
      product: true,
      person: true,
    }
  })

  return {
    sales,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    console.log('[Sales] Converting all sales to Transactions!')
    const sales = await db.sale.findMany()

    const transactions = []

    for (const sale of sales) {
      // TODO
      const transaction = {
        date: sale.date,
        description: sale.description,
        amount: sale.amount,
        personId: sale.personId,
        productId: sale.productId,
        type: 'sale',
        saleId: sale.id,
      }

      transactions.push(transaction)
    }
  }
} satisfies Actions