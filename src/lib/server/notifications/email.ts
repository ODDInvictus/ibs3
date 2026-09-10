import db from '$lib/server/db'
import nodemailer from 'nodemailer'
import type { Notification, User } from '$lib/server/prisma/client'
import { NotificationType } from '$lib/server/prisma/client'
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import { makeNotification, notificationFailed } from '.'
import { env } from '$env/dynamic/private'

let ses: SESClient

export async function initAWS() {
	if (!env.AWS_REGION) {
		logError('env AWS_REGION unset')
		return
	}

	if (!env.AWS_ACCESS_KEY_ID) {
		logError('env AWS_ACCESS_KEY_ID unset')
		return
	}

	if (!env.AWS_SECRET_ACCESS_KEY) {
		logError('env AWS_SECRET_ACCESS_KEY unset')
		return
	}

	ses = new SESClient({
		region: env.AWS_REGION,
	})
}

export async function sendNotificationOverMail(notification: Notification, html: string, text: string, user: User) {
	if (!env.EMAIL_SENDER) {
		logError('env EMAIL_SENDER unset')
		return null
	}

	if (!env.EMAIL_REPLY_TO) {
		logError('env EMAIL_REPLY_TO unset')
		return null
	}

	if (!user.personalEmail) {
		logError('user.personalEmail is unset')
		await makeNotification({ type: NotificationType.AdminNoPersonalEmail, props: { names: [user.ldapId] } }, 'discord')
		return null
	}

	if (env.NODE_ENV === 'development') {
		try {
			const transport = nodemailer.createTransport({
				host: 'raditude',
				port: 1025,
				secure: false,
			})

			await transport.sendMail({
				from: env.EMAIL_SENDER,
				replyTo: env.EMAIL_REPLY_TO,
				to: `${user.firstName} ${user.lastName} <${user.personalEmail}>`,
				subject: notification.title,
				html: html,
				text: text,
			})
		} catch (err: any) {
			await notificationFailed(err, '$lib/server/notifications/email::sendNotificationOverMail', notification)
		}
	} else {
		const options = {
			Source: env.EMAIL_SENDER,
			Destination: {
				ToAddresses: [`${user.firstName} ${user.lastName} <${user.personalEmail}>`],
			},
			ReplyToAddresses: [env.EMAIL_REPLY_TO],
			Message: {
				Subject: {
					Data: notification.title,
					Charset: 'UTF-8',
				},
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: html,
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
			await notificationFailed(err, '$lib/server/notifications/email::sendNotificationOverMail', notification)
		}
	}

	await db.notification.update({
		where: {
			id: notification.id,
		},
		data: {
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
