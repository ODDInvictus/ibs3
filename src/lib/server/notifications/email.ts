import type { Activity, Notification } from '$lib/server/prisma/client'
import { SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import { env } from '$env/dynamic/private'
import db from '$lib/server/db'
import { notificationFailed } from '.'
import { render } from 'svelte-email'
import NewActivity from '$lib/emails/NewActivity.svelte'
import nodemailer from 'nodemailer'
import { isFeut } from '../auth/helpers'
import CustomText from '$lib/emails/CustomText.svelte'

let ses: SESClient

export async function initAWS() {
	if (!env.AWS_REGION) {
		console.error('env AWS_REGION unset')
		return
	}

	if (!env.AWS_ACCESS_KEY_ID) {
		console.error('env AWS_ACCESS_KEY_ID unset')
		return
	}

	if (!env.AWS_SECRET_ACCESS_KEY) {
		console.error('env AWS_SECRET_ACCESS_KEY unset')
		return
	}

	ses = new SESClient({
		region: env.AWS_REGION,
	})
}

export async function sendCustomNotificationOverMail(notification: Notification, body: string) {
	await sendNotificationOverMail(notification, CustomText, {
		text: body,
	})
}

export async function sendNewActivityOverMail(notification: Notification, activity: Activity) {
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

async function sendNotificationOverMail(notification: Notification, template: any, extraProps: Record<any, any>) {
	if (!env.EMAIL_SENDER) {
		console.error('env EMAIL_SENDER unset')
		return
	}

	if (!env.EMAIL_REPLY_TO) {
		console.error('env EMAIL_REPLY_TO unset')
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

	const feut = isFeut(user)

	const props = {
		template: template,
		props: {
			user,
			subject: notification.title,
			isFeut: feut,
			...extraProps,
		},
	}

	const emailHtml = render(props)

	const text = render(Object.assign(props, { options: { plainText: true } }))

	if (env.NODE_ENV === 'development') {
		// if (false) {

		const transport = nodemailer.createTransport({
			host: 'localhost',
			port: 1025,
			secure: false,
		})

		await transport.sendMail({
			from: env.EMAIL_SENDER,
			replyTo: env.EMAIL_REPLY_TO,
			to: `${user.firstName} ${user.lastName} <${user.personalEmail}>`,
			subject: notification.title,
			html: emailHtml,
			text: text,
		})
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
			console.log(`Email ${notification.id} sent. SESID ${response.MessageId}`)
		} catch (err: any) {
			await notificationFailed(err)
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
