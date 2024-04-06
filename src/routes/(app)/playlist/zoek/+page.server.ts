import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ locals }) => {
	return {
		users: db.user.findMany({
			where: {
				isActive: true,
			},
			select: {
				firstName: true,
				lastName: true,
				nickname: true,
				profilePictureId: true,
				id: true,
			},
		}),
		liked: (
			await db.trackReaction.findMany({
				where: {
					userId: locals.user.id,
					liked: true,
				},
				select: {
					trackId: true,
				},
			})
		).map(reaction => reaction.trackId),
		playlist: (
			await db.track.findMany({
				where: {
					inPlaylist: true,
				},
				select: {
					id: true,
				},
			})
		).map(track => track.id),
	}
}) satisfies PageServerLoad
