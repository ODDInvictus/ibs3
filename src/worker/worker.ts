import { db } from '$lib/server/db'
import { notificationFailed } from '$lib/server/notifications'
import { sendNewActivityOverMail, sendStrafbakkenNoStrafbak } from '$lib/server/notifications/email'
import { NotificationType } from '$lib/server/prisma/enums'

declare var self: Worker

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

self.onmessage = (event: MessageEvent) => {
	log('Hallo ibs3!')

	const time = process.env.WORKER_INTERVAL ? Number.parseInt(process.env.WORKER_INTERVAL) : 10 * SECOND
	log('Starting interval every ' + time)
	setInterval(async () => {
		await work()
	}, time)
}

export async function work() {
	log('working')

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
				await sendNewActivityOverMail(notification)
				continue
			case NotificationType.StrafbakkenNoStrafbak:
				await sendStrafbakkenNoStrafbak(notification)
				continue
			default:
				await notificationFailed(new Error(`NotificationType::${notification.type.toString()} not implemented`), 'worker::work')
		}
	}
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Worker][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}

export {}
