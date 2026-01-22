import { db } from '$lib/server/db'
import { notificationFailed } from '$lib/server/notifications'
import { sendNewActivityOverMail } from '$lib/server/notifications/email'
import { NotificationType } from '$lib/server/prisma/enums'

declare var self: Worker

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

self.onmessage = (event: MessageEvent) => {}

if (!Bun.isMainThread) {
	do {
		const notifications = await db.notification.findMany({
			where: {
				sent: false,
			},
			include: {
				user: true,
			},
		})

		if (notifications.length === 0) {
			await sleep(10 * SECOND)
			continue
		}

		log(`Found ${notifications.length} notifications to send.`)

		for (const notification of notifications) {
			log(`Sending ${notification.title} to ${notification.user.firstName}`)

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
			}
		}

		await sleep(10 * SECOND)
	} while (true)
}

// function _discord()

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function log(...objects: any[]) {
	console.log('[Worker]', ...objects)
}

export {}
