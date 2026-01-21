import { NotificationType, type User } from '$lib/server/prisma/client'

type Notification = {
	title: string
	body: string
}

const handlers: { [key in NotificationType]?: (user: User) => Notification } = {
	[NotificationType.NotificationGeneric]: _notificationGeneric,
}

export function _constructNotificationFromType(type: NotificationType, user: User): Notification {
	const handler = handlers[type]

	if (!handler) {
		throw new Error('notification handler for type: ' + type.toString() + ' not found')
	}

	return handler(user)
}

function _notificationGeneric(user: User): Notification {
	return {
		title: 'IBS notificatie',
		body: 'Dit is een generieke notificatie, om te testen',
	}
}
