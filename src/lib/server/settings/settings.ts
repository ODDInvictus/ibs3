import db from '$lib/server/db'

type Settings = {
	get: (name: Setting, defaultValue?: string) => string
	getWithoutDefault: (name: Setting) => string | undefined
	getBool: (name: Setting, defaultValue?: boolean) => boolean
	getNumber: (name: Setting, defaultValue?: number) => number
	update: (settingId: number, value: string) => Promise<void>
	invalidate: () => Promise<void>
	keys: Record<Setting, string>
	unsetKeys: Setting[]
	getUnsetKeys(): Setting[]
}

export enum Setting {
	VERSION = 'VERSION',
	GIT_COMMIT = 'GIT_COMMIT',
	GITHUB_LINK = 'GITHUB_LINK',
	MALUSPUNTEN_ENABLED = 'MALUSPUNTEN_ENABLED',
	THEME_OVERRIDE = 'THEME_OVERRIDE',
	FILE_UPLOAD_ENABLED = 'FILE_UPLOAD_ENABLED',
	SPOTIFY_REFRESH_TOKEN = 'SPOTIFY_REFRESH_TOKEN',
	DEFAULT_DECLARATION_LEDGER = 'DEFAULT_DECLARATION_LEDGER',
	DEFAULT_SALE_BEER_LEDGER = 'DEFAULT_SALE_BEER_LEDGER',
	DEFAULT_SALE_FOOD_LEDGER = 'DEFAULT_SALE_FOOD_LEDGER',
	DEFAULT_SALE_OTHER_LEDGER = 'DEFAULT_SALE_OTHER_LEDGER',
	STRAFBAKKEN_VERDUBBELAAR_ENABLED = 'STRAFBAKKEN_VERDUBBELAAR_ENABLED',
}

export const settings = {
	/**
	 * Get a setting by name
	 * @param name The name of the setting
	 * @param defaultValue The default value to return if the setting is not found, if no default value is provided an error is thrown
	 * @returns The value of the setting
	 */
	get: (name: Setting, defaultValue: string): string => {
		if (defaultValue === undefined) throw new Error(`Setting ${name} has no default value`)
		if (settings.keys[name] === undefined) return defaultValue
		return settings.keys[name] as string
	},

	getWithoutDefault: (name: Setting): string | undefined => {
		return settings.keys[name]
	},

	getBool: (name: Setting, defaultValue: boolean): boolean => {
		if (defaultValue === undefined) throw new Error(`Setting ${name} has no default value`)
		if (settings.keys[name] === undefined) return false
		return settings.keys[name] === '1'
	},

	getNumber: (name: Setting, defaultValue: number): number => {
		if (defaultValue === undefined) throw new Error(`Setting ${name} has no default value`)
		if (settings.keys[name] === undefined) return 0
		return parseInt(settings.keys[name] as string)
	},

	update: async (settingId: number, value: string) => {
		const ns = await db.settings.update({
			where: { id: settingId },
			data: { value },
		})

		settings.keys[ns.name as Setting] = value
	},

	invalidate: async () => {
		console.log('[SETTINGS] Invalidating settings')

		// @ts-expect-error Ik wil hem resetten ja
		settings.keys = {}
		settings.unsetKeys = []

		await initSettings()
	},

	getUnsetKeys(): Setting[] {
		return settings.unsetKeys
	},
	unsetKeys: [] as Setting[],

	keys: {} as Record<Setting, string>,
} as Settings

export async function initSettings() {
	const s = await db.settings.findMany()
	// @ts-expect-error im not putting the enum in the db
	s.forEach(setting => (settings.keys[setting.name] = setting.value))

	// Check if all settings are present
	Object.values(Setting).forEach(setting => {
		if (settings.keys[setting] === undefined) {
			console.warn(`[SETTINGS] Setting ${setting} is not present in the database`)
			settings.unsetKeys.push(setting)
		}
	})

	console.log('[SETTINGS] Settings initialized')
}
