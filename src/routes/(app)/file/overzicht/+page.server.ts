import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const files = await db.file.findMany({
		include: {
			uploader: {
				select: {
					firstName: true,
				},
			},
		},
	})

	return { files }
}) satisfies PageServerLoad
