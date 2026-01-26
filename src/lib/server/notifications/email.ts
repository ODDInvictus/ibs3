import type { Notification } from '$lib/server/prisma/client'
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import db from '$lib/server/db'
import { notificationFailed } from '.'
import { render } from 'svelte-email'
import NewActivity from '$lib/emails/NewActivity.svelte'
import nodemailer from 'nodemailer'
import { isFeut } from '../auth/helpers'
import CustomText from '$lib/emails/CustomText.svelte'

let ses: SESClient

export async function initAWS() {
	if (!process.env.AWS_REGION) {
		logError('env AWS_REGION unset')
		return
	}

	if (!process.env.AWS_ACCESS_KEY_ID) {
		logError('env AWS_ACCESS_KEY_ID unset')
		return
	}

	if (!process.env.AWS_SECRET_ACCESS_KEY) {
		logError('env AWS_SECRET_ACCESS_KEY unset')
		return
	}

	ses = new SESClient({
		region: process.env.AWS_REGION,
	})
}

export async function sendCustomNotificationOverMail(notification: Notification, body: string) {
	await sendNotificationOverMail(notification, CustomText, {
		text: body,
	})
}

export async function sendNewActivityOverMail(notification: Notification) {
	const activity = await db.activity.findFirst({
		where: {
			id: Number.parseInt(notification.body),
		},
	})

	if (!activity) {
		await notificationFailed(
			new Error(`ActivityNew: activity ${notification.body} not found`),
			'$lib/server/notifications/email::sendNewActivityOverMail',
		)
		return
	}

	const location = await db.activityLocation.findFirst({
		where: {
			id: activity.locationId!,
		},
	})

	await sendNotificationOverMail(notification, NewActivity, {
		activity,
		location,
	})
}

export async function sendStrafbakkenNoStrafbak(notification: Notification) {
	const user = await db.user.findFirst({
		where: {
			id: Number.parseInt(notification.body),
		},
	})

	if (!user) {
		await notificationFailed(
			new Error(`StrafbakkenNoStrafbak: user ${notification.body} not found`),
			'$lib/server/notifications/email::sendStrafbakkenNoStrafbak',
		)
		return
	}
	await sendCustomNotificationOverMail(notification, `${user.firstName} heeft geen strafbakken meer! Doe er wat aan.`)
}

async function sendNotificationOverMail(notification: Notification, template: any, extraProps: Record<any, any>) {
	if (!process.env.EMAIL_SENDER) {
		logError('env EMAIL_SENDER unset')
		return
	}

	if (!process.env.EMAIL_REPLY_TO) {
		logError('env EMAIL_REPLY_TO unset')
		return
	}

	const user = await db.user.findFirstOrThrow({
		where: {
			id: notification.userId,
		},
	})

	if (!user || !user.personalEmail) {
		return
	}

	const props = {
		template: template,
		props: {
			user,
			subject: notification.title,
			isFeut: isFeut(user),
			...extraProps,
		},
	}

	const emailHtml = render(props)

	const text = render(Object.assign(props, { options: { plainText: true } }))

	if (process.env.NODE_ENV === 'development') {
		// if (false) {

		const transport = nodemailer.createTransport({
			host: 'localhost',
			port: 1025,
			secure: false,
		})

		await transport.sendMail({
			from: process.env.EMAIL_SENDER,
			replyTo: process.env.EMAIL_REPLY_TO,
			to: `${user.firstName} ${user.lastName} <${user.personalEmail}>`,
			subject: notification.title,
			html: emailHtml,
			text: text,
		})
	} else {
		const options = {
			Source: process.env.EMAIL_SENDER,
			Destination: {
				ToAddresses: [`${user.firstName} ${user.lastName} <${user.personalEmail}>`],
			},
			ReplyToAddresses: [process.env.EMAIL_REPLY_TO],
			Message: {
				Subject: {
					Data: notification.title,
					Charset: 'UTF-8',
				},
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: emailHtml,
					},
					Text: {
						Charset: 'UTF-8',
						Data: text,
					},
				},
			},
		} satisfies SendEmailCommandInput

		try {
			const command = new SendEmailCommand(options)
			const response = await ses.send(command)
			log(`Email ${notification.id} sent. SESID ${response.MessageId}`)
		} catch (err: any) {
			await notificationFailed(err, '$lib/server/notifications/email::sendNotificationOverMail')
		}
	}

	await db.notification.update({
		where: {
			id: notification.id,
		},
		data: {
			body: text,
			sent: true,
		},
	})
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Notifications][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}

function logError(...objects: any[]) {
	const date = new Date(Date.now())
	console.error(`[Notifications][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}
