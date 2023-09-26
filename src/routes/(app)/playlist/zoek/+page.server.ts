import type { PageServerLoad } from './$types';
import { getLikedTracks, getPlaylist } from '$lib/server/spotify';
import { shouldShowEgg } from '$lib/server/egghunt';

export const load = (async ({ locals }) => {
	return {
		liked: getLikedTracks(locals),
		playlist: getPlaylist(),
		egg: shouldShowEgg('UWn89YWEeurHH6NfeUFYBaewEu88uhl2iWTCh4OP18VguRs078', locals.user.id)
	};
}) satisfies PageServerLoad;
