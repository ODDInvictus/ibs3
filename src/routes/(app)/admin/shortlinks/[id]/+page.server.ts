import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './clicks/$types'

export const load = (async ({ params }) => {
	const link = await db.link.findUnique({
		where: {
			shortLink: params.id,
		},
		include: {
			user: {
				select: {
					firstName: true,
				},
			},
		},
	})

	if (!link) {
		return error(404, 'Link niet gevonden')
	}

	const clicks = await db.linkClick.findMany({
		where: {
			link: {
				shortLink: params.id,
			},
		},
		include: {
			user: {
				select: {
					firstName: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	return { clicks, link }
}) satisfies PageServerLoad
