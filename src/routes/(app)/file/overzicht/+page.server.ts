import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const files = await db.file.findMany()

	return { files }
}) satisfies PageServerLoad
