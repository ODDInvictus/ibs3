import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const name = locals.user?.firstName ?? null

	const photos = await db.frontPageItem.findMany({
		where: {
			visible: true,
		},
	})

	const temp = photos.find(p => p.key === 'temp')
	const group = photos.find(p => p.key === 'group')
	const lichtingen = photos.find(p => p.key.includes('lichting'))

	return {
		name,
		group,
		lichtingen,
		temp,
	}
}) satisfies PageServerLoad
