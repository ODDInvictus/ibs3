import { authAdmin } from '$lib/server/authorizationMiddleware'
import { error, type RequestHandler } from '@sveltejs/kit'
import db from '$lib/server/db'

export const PUT = (async ({ request, locals }) => {
	const [authorized, committees] = authAdmin(locals)
	if (!authorized) error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

	// Now we have a json body, so parse it
	const body = await request.json()

	try {
		if (body.id && body.type) {
			if (body.type === 'custom' && body.address) {
				const alias = await db.emailAlias.findFirst({
					where: { id: body.id },
					include: { EmailContact: true },
				})

				if (alias) {
					await db.emailContact.update({
						where: { id: alias.EmailContact[0].id },
						data: { address: body.address },
					})

					return new Response(JSON.stringify({ message: 'Alias geupate!' }), { status: 200 })
				}
			} else if (body.type === 'user' && body.uid) {
				const alias = await db.emailAlias.findFirst({
					where: { id: body.id },
					include: { EmailAliasUser: true },
				})

				if (alias) {
					await db.emailAliasUser.deleteMany({ where: { emailAliasId: alias.id } })
					await db.emailAliasUser.create({ data: { emailAliasId: alias.id, userId: body.uid } })

					return new Response(JSON.stringify({ message: 'Alias geupate!' }), { status: 200 })
				}
			}
		}
	} catch (err) {
		console.log(err)
		return new Response(JSON.stringify({ message: 'Alias niet geupate wegens een server fout!' }), {
			status: 500,
		})
	}

	return new Response(JSON.stringify({ message: 'Alias niet gevonden' }), { status: 404 })
}) satisfies RequestHandler
