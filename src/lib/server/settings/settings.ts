import db from '$lib/server/db'

type Settings = {
	get: (name: Setting, defaultValue?: string) => string
	getBool: (name: Setting, defaultValue?: boolean) => boolean
	getNumber: (name: Setting, defaultValue?: number) => number
	keys: Record<Setting, string>
}

export enum Setting {
	FILE_UPLOAD_DISABLED = 'FILE_UPLOAD_DISABLED',
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
	getBool: (name: Setting, defaultValue: boolean): boolean => {
		if (defaultValue === undefined) throw new Error(`Setting ${name} has no default value`)
		if (settings.keys[name] === undefined) return false
		return settings.keys[name] === 'true'
	},
	getNumber: (name: Setting, defaultValue: number): number => {
		if (defaultValue === undefined) throw new Error(`Setting ${name} has no default value`)
		if (settings.keys[name] === undefined) return 0
		return parseInt(settings.keys[name] as string)
	},
} as Settings

export async function initSettings() {
	const s = await db.settings.findMany()
	// @ts-expect-error im not putting the enum in the db
	s.forEach(setting => (settings.keys[setting.name] = setting.value))

	// Disallow changes to settings at runtime
	Object.freeze(settings)
}
