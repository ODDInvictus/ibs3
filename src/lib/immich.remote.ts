import { query } from '$app/server'
import { downloadAsset, viewAsset } from '@immich/sdk'
import z from 'zod'

export const getAssetBlob = query(z.string(), async (assetId: string): Promise<string> => {
	const blob = await downloadAsset({ id: assetId })

	// downloadAsset()
	const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64')
	return `data:${blob.type};base64,${base64}`
})
