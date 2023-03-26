import db from '$lib/server/db'

export const POST = async ({ request }) => {
  const body = await request.json()

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