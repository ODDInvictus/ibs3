import db from '$lib/server/db';
import spotify from '$lib/server/spotify';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url, locals }) => {
	const uid = Number(params.id);
	if (Number.isNaN(uid)) throw redirect(300, '/playlist');

	let page = Number(new URLSearchParams(url.search).get('p'));
	if (Number.isNaN(page)) page = 0;

	const PAGE_SIZE = 25;

	const tracks = await db.trackReaction.findMany({
		where: {
			liked: true,
			userId: uid
		},
		skip: PAGE_SIZE * page,
		take: PAGE_SIZE
	});
	if (tracks.length === 0) throw redirect(300, `/playlist/create/${uid}?p=${page - 1}`);
	const trackIds = tracks.map((track) => track.trackId);

	return {
		tracks: spotify.getTracks(trackIds),
		user: db.user.findUnique({
			where: {
				id: uid
			}
		}),
		liked: (
			await db.trackReaction.findMany({
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
		).map((track) => track.id),
		page
	};
}) satisfies PageServerLoad;
