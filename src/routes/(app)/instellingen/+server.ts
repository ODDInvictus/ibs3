import type { RequestHandler } from './$types';
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json()

  let { id, value } = body

  if (!id) {
    return new Response(JSON.stringify({ message: 'Voorkeur id is verplicht', success: false }), {
      status: 400
    })
  }

  if (typeof value === 'undefined') {
    return new Response(JSON.stringify({ message: 'Waarde is verplicht', success: false }), {
      status: 400
    })
  }

  // Check if the preference exists
  const preference = await db.preference.findFirst({
    where: {
      id: Number(id),
      userId: locals.user.id
    }
  })

  if (!preference) {
    return new Response(JSON.stringify({ message: 'Voorkeur bestaat niet', success: false }), {
      status: 404
    })
  }

  // Check if the preference is admin only
  if (preference.adminOnly) {
    return new Response(JSON.stringify({ message: 'Deze voorkeur kan alleen door admins worden bewerkt', success: false }), {
      status: 403
    })
  }

  if (body.action === 'revert') {
    value = preference.defaultValue
  }

  if (preference.value === value) {
    return new Response(JSON.stringify({ message: 'Niks veranderd', success: true }), {
      status: 200
    })
  }

  // Update the preference
  await db.preference.update({
    where: {
      id: Number(id),
    },
    data: {
      value
    }
  })

  return new Response(JSON.stringify({ message: 'Voorkeur bijgewerkt!', success: true }), {
    status: 200
  })
};