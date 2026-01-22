import { NotificationType, type Activity, type User } from '$lib/server/prisma/client'
import { db } from '$lib/server/db'
import { getUserNotificationPreference } from '../preferences'

/**
 * Send a notification to a user
 */
export async function sendNotification(title: string, body: string, user: User, type: NotificationType) {
	try {
		const preference = await getUserNotificationPreference(type, user)

		if (!preference) {
			debug(`skipping notification of type: ${type.toString()} for user: ${user.id} (${user.firstName} ${user.lastName})`)
			return
		}

		await db.notification.create({
			data: {
				title,
				body,
				type,
				sent: false,
				userId: user.id,
			},
		})
	} catch (err) {
		await notificationFailed(err as Error)
	}
}

/**
 * Send a notification to multiple users
 */
export async function sendNotificationToUsers(title: string, body: string, type: NotificationType, users: User[]) {
	users.forEach(async user => await sendNotification(title, body, user, type))
}

async function sendNotificationToAllUsers(title: string, body: string, type: NotificationType) {
	const users = await db.user.findMany({
		where: {
			isActive: true,
			accessDisabled: false,
		},
	})

	await sendNotificationToUsers(title, body, type, users)
}

export async function notificationNewActivity(activity: Activity) {
	await sendNotificationToAllUsers(`Nieuwe activiteit: ${activity.name}`, '' + activity.id, NotificationType.ActivityNew)
}

export async function notificationFailed(err: Error) {
	error('notification failed: ' + err.message)

	// TODO: send in discord

	// const admins = (
	// 	await db.committeeMember.findMany({
	// 		where: {
	// 			committee: {
	// 				ldapId: LDAP_IDS.ADMINS,
	// 			},
	// 		},
	// 		select: {
	// 			member: true,
	// 		},
	// 	})
	// ).map(cm => cm.member)

	// throw new Error('not implemented: $lib/server/notifications/index.ts::_notificationFailed')
}

function log(str: string) {
	console.log('[Notifications][' + new Date().toISOString() + ']\n' + str)
}

function debug(str: string) {
	if (process.env.NODE_ENV === 'development') {
		log(str)
	}
}

function error(str: string) {
	console.error('[Notifications][' + new Date().toISOString() + ']\n' + str)
}
