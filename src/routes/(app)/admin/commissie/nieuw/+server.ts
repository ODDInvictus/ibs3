import { authAdmin } from '$lib/server/authorizationMiddleware'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const POST = (async ({ request, locals }) => {
  const [authorized, committees] = authAdmin(locals)
  if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

  const body = await request.json()

  if (!body.ldapId) {
    return new Response(JSON.stringify({ message: 'ldapId is verplicht' }), { status: 400 })
  }

  if (!body.name) {
    return new Response(JSON.stringify({ message: 'Naam is verplicht' }), { status: 400 })
  }

  // Check if committee already exists
  const committee = await db.committee.findUnique({
    where: {
      ldapId: body.ldapId
    }
  })

  if (committee) {
    return new Response(JSON.stringify({ message: 'Commissie bestaat al' }), { status: 400 })
  }

  const ldapId = String(body.ldapId).toLowerCase()

  return await db.committee.create({
    data: {
      name: body.name,
      ldapId
    }
  }).then(() => new Response(JSON.stringify({ message: 'Commissie succesvol aangemaakt' }), { status: 200 }))
    .catch(err => new Response(JSON.stringify({ message: err.message }), { status: 500 }))
})