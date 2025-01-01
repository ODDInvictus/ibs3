import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'

export const load = (async () => {
	const photos = await db.frontPageItem.findMany()
	const description = settings.get(Setting.DESCRIPTION_INVICTUS)

	return { photos, description }
}) satisfies PageServerLoad
