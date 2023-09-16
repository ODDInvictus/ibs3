import type { PageServerLoad } from './$types';
import { getLikedTracks, getPlaylist } from '$lib/server/spotify';

export const load = (async ({ locals }) => {
	return {
		liked: getLikedTracks(locals),
		playlist: getPlaylist()
	};
}) satisfies PageServerLoad;
