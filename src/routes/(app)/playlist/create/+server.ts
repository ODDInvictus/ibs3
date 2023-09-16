import db from '$lib/server/db';
import spotify from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const PAGE_SIZE = 30;

	const url = new URL(request.url);
	const users = url.searchParams.getAll('u').map(Number).filter(Number.isInteger);
	const pageParam = url.searchParams.get('p');
	const page = Number.isNaN(Number(pageParam)) ? 0 : Number(pageParam);

	if (!users.length) return new Response(JSON.stringify([]));

	const query =
		users
			.map(
				(u) =>
					`(SELECT t.trackId FROM TrackReaction as t WHERE t.userId = ${u} AND t.liked = 1 GROUP BY t.trackId)`
			)
			.join(' INTERSECT ') + ` LIMIT ${PAGE_SIZE} OFFSET ${page * PAGE_SIZE}`;

	const trackIds = ((await db.$queryRawUnsafe(query)) as { trackId: string }[]).map(
		(t) => t.trackId
	);

	console.log(trackIds);

	if (!trackIds.length) return new Response(JSON.stringify([]));

	return new Response(
		JSON.stringify((await spotify.getTracks(trackIds, { market: 'NL' })).body.tracks)
	);
};
