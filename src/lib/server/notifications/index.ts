import type { NotificationType, User } from '@prisma/client'
import { _constructNotificationFromType } from './messages'
import db from '$lib/server/db'
import { getUserNotificationPreference } from '../preferences'
import { LDAP_IDS } from '$lib/constants'

/**
 * Send a notification to a user
 */
export async function sendNotification(type: NotificationType, user: User) {
	// First check if the user wants to receive these notifications
	//    if not, return
	// Then construct the message, fill in the username etc.
	//    if fails, throw error and send a AdminNotificationContructionFailed
	// Add it to the database, the backend will pick it up to send it
	//    if this fails, the backend will send a AdminNotificationDeliveryFailed

	try {
		// TODO: preference aanmaken indien niet bestaat
		const preference = await getUserNotificationPreference(type, user)

		if (!preference) {
			log(`skipping notification of type: ${type.toString()} for user: ${user.id} (${user.firstName} ${user.lastName})`)
			return
		}

		const notification = _constructNotificationFromType(type, user)

		const receiver = await db.notificationReceiver.findFirstOrThrow({
			where: { receiverId: user.id },
		})

		await db.notification.create({
			data: {
				title: notification.title,
				body: notification.body,
				type: type,
				sent: false,
				receiverId: receiver.id,
			},
		})
	} catch (err) {
		await _notificationFailed(err as Error)
	}
}

/**
 * Send a notification to multiple users
 */
export async function sendNotificationToUsers(type: NotificationType, users: User[]) {
	for (const user of users) {
		await sendNotification(type, user)
	}
}

async function _notificationFailed(err: Error) {
	error('notification failed: ' + err.message)

	const admins = (
		await db.committeeMember.findMany({
			where: {
				committee: {
					ldapId: LDAP_IDS.ADMINS,
				},
			},
			select: {
				member: true,
			},
		})
	).map(cm => cm.member)

	throw new Error('not implemented: $lib/server/notifications/index.ts::_notificationFailed')
}

function log(str: string) {
	console.log('[Notifications][' + new Date().toISOString() + ']\n' + str)
}

function error(str: string) {
	console.error('[Notifications][' + new Date().toISOString() + ']\n' + str)
}
