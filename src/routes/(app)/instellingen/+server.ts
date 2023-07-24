import type { RequestHandler } from './$types';
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json()

  const { id } = body
  let { value } = body

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
    },
    include: {
      base: true
    }
  })

  if (!preference) {
    return new Response(JSON.stringify({ message: 'Voorkeur bestaat niet', success: false }), {
      status: 404
    })
  }

  if (body.action === 'revert') {
    value = preference.base.defaultValue
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