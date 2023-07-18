import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/server/db";
import { z } from 'zod';
import { LEDGER_IDS } from '$lib/constants';
import { isFinancie } from '$lib/server/authorization';

export const load = (async () => {
  const fp = await db.financialPerson.findMany({
    where: { isActive: true }
  })

  const financialPeople = {}

  for (const person of fp) {
    const arr = financialPeople[person.type] || []
    arr.push(person)
    financialPeople[person.type] = arr
  }

  return {
    financialPeople,
    products: await db.product.findMany()
  };
}) satisfies PageServerLoad;

const formSchema = z.object({
  giver: z.number().positive(),
  receiver: z.number().positive(),
  amount: z.number(),
  description: z.string().min(1).max(255),
})

export const actions = {
  default: async ({ request, locals }) => {
    // first check if user is aurhorized to do this
    if (!locals.user) {
      return {
        success: false,
        message: 'Je bent niet ingelogd'
      }
    }

    // Check if user is financie
    if (!isFinancie(locals.user)) {
      return {
        success: false,
        message: 'Je bent niet geautoriseerd om deze actie uit te voeren'
      }
    }

    const data = await request.formData()

    // Validate form with formSchema
    const parse = formSchema.safeParse({
      giver: Number.parseInt(data.get('giver') ?? '-1'),
      receiver: Number.parseInt(data.get('receiver') ?? '-1'),
      amount: Number.parseFloat(data.get('amount') || '0'),
      description: data.get('description')
    })

    if (!parse.success) {
      return {
        success: false,
        error: parse.error.format()
      }
    }

    const { giver, receiver, amount, description } = parse.data
    const t = await db.transaction.create({
      data: {
        fromId: giver,
        toId: receiver,
        price: amount,
        description: 'Handmatige transactie: ' + description,
        ledgerId: LEDGER_IDS.DECLARATION_GENERIC
      }
    })

    return {
      success: true,
      message: 'Transactie is succesvol toegevoegd',
      data: t
    }

  }
} satisfies Actions;