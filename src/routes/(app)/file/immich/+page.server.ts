import { getAssetsInAlbum } from '$lib/server/files/immich'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const a = await getAssetsInAlbum('4d442600-8341-4bb4-853f-f8c763d34d26')

	return { data: a }
}) satisfies PageServerLoad
