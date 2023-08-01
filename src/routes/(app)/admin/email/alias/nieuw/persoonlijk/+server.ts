import { authAdmin } from '$lib/server/authorizationMiddleware';
import { error, type RequestHandler } from '@sveltejs/kit';
import db from '$lib/server/db'
import { z } from 'zod';

export const POST = (async ({ request, locals }) => {
  const [authorized, committees] = authAdmin(locals)
  if (!authorized) throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

  const jsonBody = await request.json()

  const zodObject = z.object({
    user: z.number().min(1),
    alias: z.string().min(1).refine(alias => !alias.includes('@')),
  })

  const parsed = zodObject.safeParse(jsonBody)

  if (!parsed.success) {
    return new Response(JSON.stringify({ message: 'Gebruiker of alias mist', success: false }), { status: 400 })
  }

  const users = await db.user.findMany({
    select: {
      ldapId: true
    }
  })

  // Now check if the alias is already in use by another user (ldapId == alias)
  const aliasInUse = users.some(user => user.ldapId === parsed.data.alias)

  if (aliasInUse) {
    return new Response(JSON.stringify({ message: 'Alias bestaat al', success: false }), { status: 400 })
  }

  const body = parsed.data

  return await db.$transaction(async (tx) => {
    const alias = await tx.emailAlias.create({
      data: {
        alias: body.alias,
      }
    })

    await tx.emailAliasUser.create({
      data: {
        emailAliasId: alias.id,
        userId: body.user
      }
    })
  })
    .then(() => {
      return new Response(JSON.stringify({ message: 'Alias aangemaakt! Je wordt geredirect na een aantal seconden', success: true }), { status: 200 })
    })
    .catch(err => {
      console.log(err)
      return new Response(JSON.stringify({ message: 'Alias bestaat al', success: false }), { status: 500 })
    })
}) satisfies RequestHandler;