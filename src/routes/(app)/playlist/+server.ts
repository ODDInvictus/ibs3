import db from '$lib/server/db';
import spotify, { refreshToken } from '$lib/server/spotify';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

const { PUBLIC_MIN_LIKES, PUBLIC_PLAYLIST_ID } = env;

const MIN_LIKES = Number.isNaN(Number(PUBLIC_MIN_LIKES)) ? 4 : Number(PUBLIC_MIN_LIKES);

export const GET: RequestHandler = async ({ request }) => {
	const url = new URL(request.url);
	const params = new URLSearchParams(url.search);
	const id = params.get('id');
	if (!id) return new Response('ID param missing', { status: 400 });

	try {
		const track = await spotify.getTrack(id);
		return new Response(JSON.stringify(track.body));
	} catch (error) {
		// Try refreshing the token as it might be expired
		try {
			await refreshToken();
			const track = await spotify.getTrack(id);
			return new Response(JSON.stringify(track.body));
		} catch (error) {
			console.error(error);
			return new Response(JSON.stringify('Error'), { status: 500 });
		}
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user.id;
	const { trackId, liked, trackUri }: { trackId: string; liked: boolean; trackUri: string } =
		await request.json();

	try {
		const track = await db.track.upsert({
			where: {
				id: trackId
			},
			update: {},
			create: {
				id: trackId
			}
		});

		await db.trackReaction.upsert({
			where: {
				userId_trackId: {
					userId,
					trackId
				}
			},
			update: {
				liked
			},
			create: {
				userId,
				trackId,
				liked
			}
		});

		const count = await db.trackReaction.count({
			where: {
				trackId,
				liked: true
			}
		});

		if (count < MIN_LIKES || track.inPlaylist) return new Response();
	} catch (error) {
		console.error(error);
		return new Response('Error', { status: 500 });
	}

	try {
		await spotify.addTracksToPlaylist(PUBLIC_PLAYLIST_ID, [trackUri]);
	} catch (error) {
		try {
			await refreshToken();
			await spotify.addTracksToPlaylist(PUBLIC_PLAYLIST_ID, [trackUri]);
		} catch (error) {
			console.error(error);
			return new Response('Error', { status: 500 });
		}
	}

	try {
		await db.track.update({
			where: {
				id: trackId
			},
			data: {
				inPlaylist: true
			}
		});
	} catch (error) {
		console.error(error);
		return new Response('Error', { status: 500 });
	}

	return new Response();
};
