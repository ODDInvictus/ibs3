import type { PageServerLoad } from './$types'
import spotify from '$lib/server/spotify'
import db from '$lib/server/db'

export const load = (async ({ params }) => {
	try {
		var track = await spotify.getTrack(params.id)
	} catch (error: any) {
		console.error(error)
		return { error: error?.body?.error?.message ?? 'Unknown error' }
	}

	return {
		track,
		reactions: await db.track.findUnique({
			where: {
				id: params.id,
			},
			include: {
				likes: {
					include: {
						user: {
							select: {
								nickname: true,
								firstName: true,
								lastName: true,
								profilePicture: true,
								id: true,
							},
						},
					},
				},
			},
		}),
	}
}) satisfies PageServerLoad
