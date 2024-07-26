import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ locals }) => {
	const preferences = await db.preference.findMany({
		where: {
			userId: locals.user.id,
		},
		include: {
			base: true,
		},
	})

	const tokens = await db.accessToken.findMany({
		where: {
			userId: locals.user.id,
		},
	})

	return {
		preferences,
		tokens,
		currentTheme: locals.user.preferredTheme,
	}
}) satisfies PageServerLoad
