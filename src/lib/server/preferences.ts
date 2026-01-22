import type { NotificationType, User } from '$lib/server/prisma/client'
import { db } from './db'

export async function getUserPreference(key: string, user: User): Promise<boolean> {
	let base = await db.basePreference.findFirst({
		where: {
			key,
		},
	})

	if (!base) {
		console.log(`No base preference found with key ${key}, creating it...`)
		base = await db.basePreference.create({
			data: {
				key,
				defaultValue: true,
				description: key,
			},
		})
	}

	let preference = await db.preference.findFirst({
		where: {
			baseId: base.id,
			userId: user.id,
		},
	})

	if (!preference) {
		preference = await db.preference.create({
			data: {
				userId: user.id,
				baseId: base.id,
				value: true,
			},
		})
	}

	return preference.value
}

export async function getUserNotificationPreference(type: NotificationType, user: User): Promise<boolean> {
	const key = 'Notification::' + type.toString()
	return getUserPreference(key, user)
}
