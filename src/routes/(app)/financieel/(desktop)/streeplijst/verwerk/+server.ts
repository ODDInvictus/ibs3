import { getFinancialPeople, getProducts } from '$lib/server/financial';
import db from '$lib/server/db'
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authFinance } from '$lib/server/authorizationMiddleware';


export const POST = (async ({ request, locals }) => {
  // First check authorization
  const [authorized, committees] = authFinance(locals)
  if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

  const data = await request.json()
  const people = await getFinancialPeople()
  const products = await getProducts()

  // Now we check if all people,products and amounts are valid
  // If not, we return a 400 error

  for (const item of data) {
    const person = people.find(p => p.id === item.person)
    if (!person) {
      throw error(400, 'Ongeldig persoon in rij ' + item.id)
    }

    const product = products.find(p => p.id === item.product)
    if (!product) {
      throw error(400, 'Ongeldig product in rij ' + item.id)
    }

    if (item.amount <= 0) {
      throw error(400, 'Ongeldig aantal in rij ' + item.id)
    }
  }

  // We know all data is valid, so we can save it

  type SaleCreate = {
    personId: number,
    productId: number,
    amount: number,
    streeplijstId: number,
  }

  await db.$transaction(async (tx) => {
    const person = await tx.financialPersonDataUser.findFirst({
      where: {
        userId: locals.user.id
      }
    })

    if (!person) {
      throw error(500, 'Geen persoon gevonden')
    }

    const streeplijst = await tx.streeplijst.create({
      data: {
        date: new Date(),
        personId: person.personId,

      }
    })

    const sales: SaleCreate[] = []

    for (const item of data) {
      sales.push({
        personId: item.person,
        productId: item.product,
        amount: item.amount,
        streeplijstId: streeplijst.id
      })
    }

    await tx.sale.createMany({ data: sales })
      .catch(err => {
        throw error(500, 'Fout bij opslaan van gegevens: ' + err.message)
      })
  })

  return new Response('ok')
}) satisfies RequestHandler;