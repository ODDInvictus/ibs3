import { getAlbumInfo, getAllAlbums, getAssetMetadata, getPerson, init, searchAssets, uploadAsset, viewAsset } from '@immich/sdk'

export async function initImmich() {
	const baseUrl = process.env.IMMICH_URL
	const apiKey = process.env.IMMICH_API_KEY

	if (!baseUrl || !apiKey) {
		log('IMMICH_URL or IMMICH_API_KEY unset, immich integration not initializing')
		return
	}

	log('initializing')
	init({ baseUrl, apiKey })
}

export async function uploadPhotoToImmich() {}

export async function syncIbs3WithImmich() {
	// uploadAsset({
	// })
}

export async function getAssetsInAlbum(albumId: string) {
	const filter = {
		metadataSearchDto: {
			filter: {
				albumIds: {
					all: [albumId],
				},
			},
		},
	}

	const assets = []

	let data = await searchAssets(filter)

	while (data.assets.nextCursor) {
		assets.push(...data.assets.items)
		data = await searchAssets({
			...filter,
			metadataSearchDto: {
				cursor: data.assets.nextCursor,
			},
		})
	}

	assets.push(...data.assets.items)

	return assets
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Immich][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}
