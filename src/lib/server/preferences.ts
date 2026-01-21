import type { NotificationType, User } from '$lib/server/prisma/client'

export async function getUserPreference(key: string, user: User): Promise<boolean> {
	return false
}

export async function getUserNotificationPreference(type: NotificationType, user: User): Promise<boolean> {
	const key = 'NOTIFICATION_' + type.toString()
	return getUserPreference(key, user)
}
