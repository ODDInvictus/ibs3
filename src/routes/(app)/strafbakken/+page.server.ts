import type { Actions, PageServerLoad } from './$types'
import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { Setting, settings } from '$lib/server/settings'
import { giveStrafbak } from '$lib/server/strafbakken'

// Load een overview van alle strafbakken
export const load = (async () => {
	return {
		strafbakken: await db.user.findMany({
			where: {
				isActive: true,
			},
			select: {
				firstName: true,
				nickname: true,
				id: true,
				_count: {
					select: {
						StrafbakReceived: {
							where: {
								dateDeleted: null,
							},
						},
					},
				},
			},
			orderBy: [
				{
					becameMember: {
						sort: 'asc',
						nulls: 'last',
					},
				},
				{
					becameFeut: {
						sort: 'asc',
						nulls: 'last',
					},
				},
				{
					firstDrink: {
						sort: 'asc',
						nulls: 'last',
					},
				},
			],
		}),
	}
}) satisfies PageServerLoad

export const actions = {
	// Geef een strafbak
	default: async event => {
		const { request, locals } = event

		const giverId = locals.user.id
		const data = await request.formData()
		let reason = data.get('reason')?.toString() || undefined
		const receiverId = Number(data.get('receiver'))

		try {
			await giveStrafbak(giverId, receiverId, reason ?? 'Geen reden opgegeven')
		} catch {
			// Oftewel, de receiverId bestaat niet
			return fail(400)
		}
		return { succes: true }
	},
} satisfies Actions
