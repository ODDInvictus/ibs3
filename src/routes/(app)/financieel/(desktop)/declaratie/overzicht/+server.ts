import db from '$lib/server/db'
import { authFinance } from '$lib/server/authorizationMiddleware'
import { LEDGER_IDS } from '$lib/constants'

export const POST = async ({ request, locals }) => {
  const body = await request.json()

  const [auth, committees] = authFinance(locals)

  if (!auth) {
    return new Response(JSON.stringify({
      status: 401,
      message: 'Helaas heb jij geen rechten om dit te doen. Je mist een van de volgende rollen: ' + committees.join(', ')
    }))
  }

  try {
    if (body.type === 'accept') {
      const decla = await db.declaration.update({
        where: {
          id: body.id
        },
        data: {
          accepted: true
        }
      })

      // Get the INVICTUS account
      const invictus = await db.financialPerson.findFirst({
        where: {
          type: 'INVICTUS'
        }
      })
  
      // create a transaction
      await db.transaction.create({
        data: {
          price: decla.price,
          description: `Declaratie ${decla.id} - ${decla.reason}`,
          createdAt: decla.date,
          fromId: invictus.id,
          toId: decla.personId,
          ledgerId: LEDGER_IDS.DECLARATION_GENERIC
        }
      })
  
    } else if (body.type === 'decline') {
      await db.declaration.update({
        where: {
          id: body.id
        },
        data: {
          denied: true
        }
      })
  
      // Done!
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({
      status: 500,
      message: error.message  
    }))
  }

  return new Response(JSON.stringify({
    status: 200
  }))
}