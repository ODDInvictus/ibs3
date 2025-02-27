import type { Actions, PageServerLoad } from './$types'
import db, { getFeuten, getMembers } from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'
import { isMember } from '$lib/server/auth'

export const load = (async ({ locals }) => {
	const ok = isMember(locals.user)

	if (!ok) {
		await db.strafbak.create({
			data: {
				receiverId: locals.user.id,
				reason: 'Feutneus denkt dat hij de maluspunten kan bekijken 🤨',
				location: 'Maluspunten',
			},
		})

		return error(444)
	}

	return {
		maluspunten: await db.maluspunt.findMany({
			include: {
				giver: true,
				receiver: true,
			},
		}),
		feuten: await getFeuten(),
		members: await getMembers(),
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData()

		const giverId = Number(data.get('giverId'))
		const receiverId = Number(data.get('receiverId'))
		const amount = Number(data.get('amount'))
		let reason = data.get('reason')?.toString()

		if (!giverId || !receiverId || !amount) {
			return fail(400, { message: 'Niet alle velden zijn ingevuld' })
		}

		if (!reason) {
			reason = 'Geen reden opgegeven'
		}

		// do not need a number check since the Number() function will return NaN if it can't parse the string

		await db.maluspunt.create({
			data: { giverId, receiverId, reason, amount },
		})
	},
} satisfies Actions
