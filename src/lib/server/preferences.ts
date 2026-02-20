import type { NotificationType, User } from '$lib/server/prisma/client'
import { db } from '$lib/server/db'

export async function getUserPreference(key: string, user: User): Promise<boolean> {
	// create basePreference if not exists
	let base = await db.basePreference.findFirst({
		where: {
			key,
		},
	})

	if (!base) {
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
			baseKey: key,
			userId: user.id,
		},
	})

	if (!preference) {
		preference = await db.preference.create({
			data: {
				userId: user.id,
				baseKey: key,
				value: base.defaultValue,
			},
		})
	}

	return preference.value
}

export async function getUserNotificationPreference(type: NotificationType, user: User): Promise<boolean> {
	const key = 'Notification::' + type.toString()
	return getUserPreference(key, user)
}
