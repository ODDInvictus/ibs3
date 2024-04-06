import { authAdmin } from '$lib/server/authorizationMiddleware'
import { error, type RequestHandler } from '@sveltejs/kit'
import db from '$lib/server/db'
import { z } from 'zod'

export const POST = (async ({ request, locals }) => {
	const [authorized, committees] = authAdmin(locals)
	if (!authorized)
		throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

	const jsonBody = await request.json()

	const zodObject = z.object({
		alias: z
			.string()
			.min(1)
			.refine(alias => !alias.includes('@')),
		email: z.string().min(6).email(),
	})

	const parsed = zodObject.safeParse(jsonBody)

	if (!parsed.success) {
		return new Response(
			JSON.stringify({
				message: 'Alias of email mist of email is niet een valide adres',
				success: false,
			}),
			{ status: 400 },
		)
	}

	const body = parsed.data

	return await db
		.$transaction(async tx => {
			const alias = await tx.emailAlias.create({ data: { alias: body.alias } })

			await tx.emailContact.create({ data: { address: body.email, emailAliasId: alias.id } })
		})
		.then(() => {
			return new Response(
				JSON.stringify({
					message: 'Alias aangemaakt! Je wordt geredirect na een aantal seconden',
					success: true,
				}),
				{ status: 200 },
			)
		})
		.catch(err => {
			console.log(err)
			return new Response(JSON.stringify({ message: 'Alias bestaat al', success: false }), {
				status: 500,
			})
		})
}) satisfies RequestHandler
