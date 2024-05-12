import db from './db'
import NodeCache from 'node-cache'
import type { Settings } from '@prisma/client'
import { env } from '$env/dynamic/private'

// Cache for 24 hours
// This is so that we don't have to query the database every time we want to get a setting
// And we then do have the option of updating the database manually
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 })

export async function getSettings(): Promise<Settings[]> {
	if (env.ENVIRONMENT !== 'test' && cache.has('settings')) {
		// TypeScript kijk nou eens wat in die if statement staat
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return cache.get<Settings[]>('settings')!
	}

	const settings = await db.settings.findMany()

	cache.set('settings', settings)

	return settings
}

export async function updateSetting(name: string, value: string): Promise<void> {
	await db.settings.update({
		where: {
			name,
		},
		data: {
			value,
		},
	})

	// Rebuild the cache
	cache.del('settings')
	// Rebuild the cache
	await getSettings()
}

export async function getSetting(name: string): Promise<string> {
	const settings = await getSettings()

	const setting = settings.find(setting => setting.name === name)

	if (!setting) {
		throw new Error(`Setting ${name} not found`)
	}

	return setting.value
}

export async function newSetting(name: string, value: string, description: string): Promise<Settings[]> {
	await db.settings.create({
		data: {
			name,
			value,
			description,
		},
	})

	// Rebuild the cache
	cache.del('settings')
	// Rebuild the cache
	return await getSettings()
}
