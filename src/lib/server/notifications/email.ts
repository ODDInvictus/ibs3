import db from '$lib/server/db'
import nodemailer from 'nodemailer'
import type { Notification, User } from '$lib/server/prisma/client'
import { NotificationType } from '$lib/server/prisma/client'
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import { makeNotification, notificationFailed } from '.'

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

export async function sendNotificationOverMail(notification: Notification, html: string, text: string, user: User) {
	if (!process.env.EMAIL_SENDER) {
		logError('env EMAIL_SENDER unset')
		return null
	}

	if (!process.env.EMAIL_REPLY_TO) {
		logError('env EMAIL_REPLY_TO unset')
		return null
	}

	if (!user.personalEmail) {
		logError('user.personalEmail is unset')
		await makeNotification({ type: NotificationType.AdminNoPersonalEmail, props: { names: [user.ldapId] } }, 'discord')
		return null
	}

	if (process.env.NODE_ENV === 'development') {
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
			html: html,
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
