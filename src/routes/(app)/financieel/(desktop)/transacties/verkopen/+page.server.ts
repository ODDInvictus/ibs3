import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { error, redirect, type Actions } from '@sveltejs/kit';
import { FinancialPersonType, ProductType } from '@prisma/client';
import { LEDGER_IDS } from '$lib/constants';
import { fail } from '@sveltejs/kit';
import { isFinancie } from '$lib/server/authorization';

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
    // @ts-expect-error als je niet je eigen .d.ts kan lezen, moet je ook niet piepen
    const user: User = event.locals.user

    if (!isFinancie(user)) return error(403, 'Geen toegang tot deze actie!')
  

    console.log('[Sales] Converting all sales to Transactions!')
    const sales = await db.sale.findMany({
      include: {
        product: true,
        person: true
      }
    })
    const invictus = await db.financialPerson.findFirst({
      where: {
        type: FinancialPersonType.INVICTUS
      }
    })

    if (!invictus) {
      throw new Error('FinancialPerson with type INVICTUS not found!')
    }

    const transactions = []

    for (const sale of sales) {

      const ledgerId = getLedgerId(sale.product.productType)

      const transaction = {
        ledgerId,
        description: "Verkoop: " + sale.product.name,
        price: sale.product.price * sale.amount,
        settled: false,
        fromId: sale.person.id,
        toId: invictus.id
      }

      transactions.push(transaction)
    }

    try {
      await db.transaction.createMany({
        data: transactions
      })
    } catch (err) {
      console.error(err)
      throw fail(500, {
        message: 'Failed to create transactions',
        error: err
      })
    }

    // Now we delete all sales
    try {
      await db.sale.deleteMany()
    } catch (err) {
    
      console.error(err)
      throw fail(500, {
        message: 'Failed to delete sales',
        error: err
      })
    }

    // And redirect back to /financieel/transacties
    throw redirect(300, '/financieel/transacties')
  }
} satisfies Actions

const getLedgerId = (type: ProductType) => {
  switch (type) {
    case ProductType.ALCOHOL:
      return LEDGER_IDS.SALE_BEER
    case ProductType.FOOD:
      return LEDGER_IDS.SALE_FOOD
    case ProductType.OTHER:
      return LEDGER_IDS.SALE_OTHER
  }
}