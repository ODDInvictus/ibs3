import { isMember } from '$lib/server/auth'
import { db } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

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

	const maluspunten = await db.maluspunt.findMany({
		include: {
			receiver: {
				select: {
					firstName: true,
				},
			},
			giver: {
				select: {
					firstName: true,
				},
			},
		},
	})
	return { maluspunten }
}) satisfies PageServerLoad
