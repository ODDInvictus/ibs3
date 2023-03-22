import { getFinancialPeople, getProducts } from '$lib/server/financial';
import db from '$lib/server/db'
import { error } from '@sveltejs/kit';
import type { User } from '@prisma/client'
import type { RequestHandler } from './$types';
import { isFinancie } from '$lib/server/authorization';


export const POST = (async ({ request, locals }) => {
  // @ts-expect-error als je niet je eigen .d.ts kan lezen, moet je ook niet piepen
  const user: User = locals.user

  if (!isFinancie(user)) return error(403, 'Geen toegang tot deze actie!')
  
  const data = await request.json()
  const people = await getFinancialPeople()
  const products = await getProducts()



  console.log({ data, people, products })

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

  const sales = []

  for (const item of data) {
    sales.push({
      personId: item.person,
      productId: item.product,
      amount: item.amount
    })
  }

  await db.sale.createMany({ data: sales })
    .catch(err => {
      throw error(500, 'Fout bij opslaan van gegevens: ' + err.message)
    })

  return new Response('ok')
}) satisfies RequestHandler;