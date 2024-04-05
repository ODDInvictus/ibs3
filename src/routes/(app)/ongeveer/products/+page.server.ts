import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		products: await db.product.findMany({
			where: { isActive: true },
			select: { name: true, id: true },
		}),
	}
}) satisfies PageServerLoad
