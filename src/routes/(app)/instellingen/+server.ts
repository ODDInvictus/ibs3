import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { invalidateUser } from '$lib/server/userCache'
import { LDAP_IDS } from '$lib/constants'

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json()

	if (body.action === 'edit') {
		const { id } = body
		let { value } = body

		if (!id) {
			return new Response(JSON.stringify({ message: 'Voorkeur id is verplicht', success: false }), {
				status: 400,
			})
		}

		if (typeof value === 'undefined') {
			return new Response(JSON.stringify({ message: 'Waarde is verplicht', success: false }), {
				status: 400,
			})
		}

		// Check if the preference exists
		const preference = await db.preference.findFirst({
			where: {
				id: Number(id),
				userId: locals.user.id,
			},
			include: {
				base: true,
			},
		})

		if (!preference) {
			return new Response(JSON.stringify({ message: 'Voorkeur bestaat niet', success: false }), {
				status: 404,
			})
		}

		if (body.action === 'revert') {
			value = preference.base.defaultValue
		}

		if (preference.value === value) {
			return new Response(JSON.stringify({ message: 'Niks veranderd', success: true }), {
				status: 200,
			})
		}

		// Update the preference
		await db.preference.update({
			where: {
				id: Number(id),
			},
			data: {
				value,
			},
		})

		return new Response(JSON.stringify({ message: 'Voorkeur bijgewerkt!', success: true }), {
			status: 200,
		})
	} else if (body.action === 'theme') {
		const { theme } = body

		if (!theme) {
			return new Response(JSON.stringify({ message: 'Thema is verplicht', success: false }), {
				status: 400,
			})
		}

		if (locals.user.preferredTheme === theme) {
			return new Response(JSON.stringify({ message: 'Niks veranderd', success: true }), {
				status: 200,
			})
		}

		// check if the user is allowed to use this theme
		const isFeut = locals.committees.filter(c => c.ldapId === LDAP_IDS.FEUTEN).length > 0

		if (isFeut) {
			return new Response(
				JSON.stringify({
					message: 'Leuk geprobeerd, maar je mag helemaal het thema niet aanpassen',
					success: false,
				}),
				{
					status: 200,
				},
			)
		}

		// Update the preference
		await db.user.update({
			where: {
				id: locals.user.id,
			},
			data: {
				preferredTheme: theme,
			},
		})

		invalidateUser(locals.user.email)

		return new Response(JSON.stringify({ message: 'Thema bijgewerkt!', success: true }), {
			status: 200,
		})
	} else {
		return new Response(JSON.stringify({ message: 'Actie niet toegestaan', success: false }), {
			status: 400,
		})
	}
}
