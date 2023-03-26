import db from '$lib/server/db'
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
  if (isNaN(params.id)) throw error(404, `Declaratie ${params.id} niet gevonden`)

  const declaration = await db.declaration.findFirst({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!declaration) throw error(404, `Declaratie ${params.id} niet gevonden`)

  return {
    declaration
  }
})