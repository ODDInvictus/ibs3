import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async ({ locals }) => {
	return {
		liked: (
			await db.reaction.findMany({
				where: {
					userId: locals.user.id,
					liked: true
				},
				select: {
					trackId: true
				}
			})
		).map((reaction) => reaction.trackId),
		playlist: (
			await db.track.findMany({
				where: {
					inPlaylist: true
				},
				select: {
					id: true
				}
			})
		).map((track) => track.id)
	};
}) satisfies PageServerLoad;
