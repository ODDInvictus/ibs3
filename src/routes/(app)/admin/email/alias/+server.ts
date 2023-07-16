import { authAdmin } from '$lib/server/authorizationMiddleware';
import { error, type RequestHandler } from '@sveltejs/kit';
import db from '$lib/server/db'

export const DELETE = (async ({ url, locals }) => {
  // First check if the user is allowed to delete this alias
  // Then delete the alias
  // Then redirect to the alias page
  const [authorized, committees] = authAdmin(locals)
  if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

  const id = Number(url.searchParams.get('id'));

  console.log(id)

  if (id) {
    try {
      await db.emailAlias.delete({
        where: {
          id
        }
      })
    } catch (err) {
      console.error('[Admin/Email/Alias]', err)
      return new Response(JSON.stringify({ message: 'Verwijderen mislukt' }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: 'Verwijderen gelukt!' }), { status: 200 })
  }

  return new Response(JSON.stringify({ message: 'Alias niet gevonden' }), { status: 404 })
}) satisfies RequestHandler;