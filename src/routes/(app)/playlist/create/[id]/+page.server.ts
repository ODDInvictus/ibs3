import db from '$lib/server/db'
import spotify, { refreshToken } from '$lib/server/spotify'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, url, locals }) => {
	const uid = Number(params.id)
	if (Number.isNaN(uid)) throw redirect(300, '/playlist')

	let page = Number(new URLSearchParams(url.search).get('p'))
	if (Number.isNaN(page) || page < 1) page = 1

	const PAGE_SIZE = 25

	const trackCountReq = db.trackReaction.count({
		where: {
			liked: true,
			userId: uid,
		},
	})

	const tracksReq = db.trackReaction.findMany({
		where: {
			liked: true,
			userId: uid,
		},
		skip: PAGE_SIZE * (page - 1),
		take: PAGE_SIZE,
	})

	const [tracks, trackCount] = await Promise.all([tracksReq, trackCountReq])

	if (tracks.length === 0 && page > 1) throw redirect(300, `/playlist/create/${uid}?p=${Math.floor(trackCount / PAGE_SIZE) + 1}`)

	let res: SpotifyApi.TrackObjectFull[] = []
	if (tracks.length > 0) {
		const trackIds = tracks.map(track => track.trackId)
		try {
			res = (await spotify.getTracks(trackIds)).body.tracks
		} catch (e) {
			await refreshToken()
			try {
				res = (await spotify.getTracks(trackIds)).body.tracks
			} catch (e) {
				console.error(e)
				throw error(500, 'Failed to get tracks from Spotify')
			}
		}
	}

	return {
		tracks: res,
		playlistUser: db.user.findUnique({
			where: {
				id: uid,
			},
			select: {
				firstName: true,
				nickname: true,
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
		page,
		maxPage: Math.floor(trackCount / PAGE_SIZE) - 1,
	}
}) satisfies PageServerLoad
