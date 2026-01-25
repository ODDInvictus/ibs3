import { db } from '$lib/server/db'
import { notificationFailed } from '$lib/server/notifications'
import { sendCustomNotificationOverMail, sendNewActivityOverMail } from '$lib/server/notifications/email'
import { NotificationType } from '$lib/server/prisma/enums'

declare var self: Worker

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

self.onmessage = (event: MessageEvent) => {
	console.log('Hallo ibs3!')
}

if (!Bun.isMainThread) {
	setInterval(async () => {
		await work()
	}, 10 * SECOND)
}

export async function work() {
	console.log('working')

	const notifications = await db.notification.findMany({
		where: {
			sent: false,
		},
		include: {
			user: true,
		},
	})

	if (notifications.length === 0) {
		return
	}

	log(`Found ${notifications.length} notifications to send.`)

	for (const notification of notifications) {
		log(`Sending ${notification.title} (${notification.type.toString()}) to ${notification.user.firstName}`)

		switch (notification.type) {
			case NotificationType.ActivityNew:
				const activity = await db.activity.findFirst({
					where: {
						id: Number.parseInt(notification.body),
					},
				})

				if (!activity) {
					await notificationFailed(new Error(`ActivityNew: activity ${notification.body} not found`))
					continue
				}

				await sendNewActivityOverMail(notification, activity)
				continue
			case NotificationType.StrafbakkenNoStrafbak:
				const user = await db.user.findFirst({
					where: {
						id: Number.parseInt(notification.body),
					},
				})

				if (!user) {
					await notificationFailed(new Error(`StrafbakkenNoStrafbak: user ${notification.body} not found`))
					continue
				}

				await sendCustomNotificationOverMail(notification, `${user.firstName} heeft geen strafbakken meer! Doe er wat aan.`)
				continue
		}
	}
}

function log(...objects: any[]) {
	console.log('[Worker]', ...objects)
}

export {}
