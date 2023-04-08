import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { error, redirect, type Actions } from '@sveltejs/kit';
import { FinancialPersonType, ProductType } from '@prisma/client';
import { LEDGER_IDS } from '$lib/constants';
import { fail } from '@sveltejs/kit';
import { authFinance } from '$lib/server/authorizationMiddleware';

export const load = (async () => {
  const sales = await db.sale.findMany({
    include: {
      product: true,
      person: true,
    },
    where: {
      isActive: true,
    }
  })

  return {
    sales,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // First check authorization
    const [authorized, committees] = authFinance(event.locals)
    if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

    console.log('[Sales] Converting all sales to Transactions!')
    const sales = await db.sale.findMany({
      include: {
        product: true,
        person: true
      },
      where: {
        isActive: true
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

    type TransactionCreate = {
      ledgerId: number
      description: string
      price: number
      fromId: number
      toId: number
    }

    const transactions: TransactionCreate[] = []

    for (const sale of sales) {

      const ledgerId = getLedgerId(sale.product.productType)

      const transaction = {
        ledgerId,
        description: "Verkoop: " + sale.product.name,
        price: sale.product.price * sale.amount,
        fromId: sale.person.id,
        toId: invictus.id
      }

      transactions.push(transaction)
    }


    db.$transaction(async (tx) => {
      await tx.transaction.createMany({
        data: transactions
      })

      // Now we set the `isActive` flag to false
      await tx.sale.updateMany({
        data: {
          isActive: false
        }
      })
    }).catch(err => {
      throw fail(500, {
        message: 'Failed to create transactions',
        error: err
      })
    })

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