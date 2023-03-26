import db from '$lib/server/db'
import { authFinance } from '$lib/server/authorizationMiddleware'

export const POST = async ({ request, locals }) => {
  const body = await request.json()

  if (!authFinance(locals)) {
    return new Response(JSON.stringify({
      status: 401,
      message: 'Helaas heb jij geen rechten om dit te doen.'
    }))
  }

  try {
    console.log(body)
    if (body.type === 'accept') {
      const decla = await db.declaration.update({
        where: {
          id: body.id
        },
        data: {
          accepted: true
        }
      })
  
      // change the balance
      await db.financialPerson.update({
        where: {
          id: decla.personId
        },
        data: {
          balance: {
            increment: decla.price
          }
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
    return new Response(JSON.stringify({
      status: 500
    }))
  }

  return new Response(JSON.stringify({
    status: 200
  }))
}