import db from '$lib/server/db';
import { getLikedTracks, getPlaylist } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals, fetch }) => {
	const users = url.searchParams.getAll('u').map(Number).filter(Number.isInteger);

	return {
		tracks: await (await fetch(`/playlist/create?u=${users.join('&u=')}`)).json(),
		liked: getLikedTracks(locals),
		playlist: getPlaylist(),
		users: db.user.findMany({
			select: {
				id: true,
				firstName: true,
				nickname: true,
				picture: true
			}
		})
	};
}) satisfies PageServerLoad;
