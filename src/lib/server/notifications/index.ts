import { NotificationType, type Activity, type ActivityLocation, type Notification, type User } from '$lib/server/prisma/client'
import { db } from '$lib/server/db'
import { getUserNotificationPreference } from '../preferences'
import {
	notifyDiscordErrorNotification,
	notifyDiscordAdminNotification,
	notifyDiscordPublicNotification,
	notifyDiscordActivityNotification,
} from './discord'
import { env } from '$env/dynamic/private'
import { LDAP_IDS } from '$lib/constants'
import { render } from 'svelte-email'
import { sendNotificationOverMail } from './email'

import CustomText from '$lib/emails/CustomText.svelte'
import NewActivity from '$lib/emails/NewActivity.svelte'
import ActivityChangedDate from '$lib/emails/ActivityChangedDate.svelte'
import ActivityFillInReminder from '$lib/emails/ActivityFillInReminder.svelte'

type Template = {
	title: string
	template: any
	text?: string
	props?: {
		customFooter?: string
		customGreeting?: string
	}
}

const templates: Record<NotificationType, Template> = {
	NotificationGeneric: {
		title: 'IBS Notificatie',
		template: CustomText,
	},
	ActivityNew: {
		title: 'Nieuwe activiteit: {1}',
		template: NewActivity,
	},
	ActivityChangedDate: {
		title: 'Activiteit {1} verplaatst',
		template: ActivityChangedDate,
	},
	ActivityFillInReminder: {
		title: 'Reminder',
		template: ActivityFillInReminder,
		props: {
			customFooter: 'Je ontvangt deze e-mail omdat je een luie hond bent.',
		},
	},
	StrafbakCreate: {
		title: 'niet geimplementeerd',
		template: CustomText,
	},
	StrafbakDouble: {
		title: 'niet geimplementeerd',
		template: CustomText,
	},
	StrafbakMaster: {
		title: 'niet geimplementeerd',
		template: CustomText,
	},
	StrafbakNoStrafbak: {
		title: 'Geen strafbakken!',
		template: CustomText,
		text: 'Oei! {1} heeft geen strafbakken meer. Doe er wat aan!',
	},
	LeaderboardGotBeaten: {
		title: 'niet geimplementeerd',
		template: CustomText,
	},
	AdminNoPersonalEmail: {
		title: 'niet geimplementeerd',
		template: undefined,
	},
	AdminSettingNotFound: {
		title: 'niet geimplementeerd',
		template: undefined,
	},
	AdminError: {
		title: 'niet geimplementeerd',
		template: undefined,
	},
	AdminShitpost: {
		title: 'niet geimplementeerd',
		template: undefined,
	},
}

type NotificationPayload =
	| { type: 'NotificationGeneric'; props: undefined }
	| { type: 'ActivityNew'; props: { id: number } }
	| { type: 'ActivityChangedDate'; props: { oldDate: Date; id: number } }
	| { type: 'ActivityFillInReminder'; props: { ids: number[] } }
	| { type: 'StrafbakCreate'; props: { giverLdapId: string } }
	| { type: 'StrafbakDouble'; props: undefined }
	| { type: 'StrafbakMaster'; props: { ldapId: string } }
	| { type: 'StrafbakNoStrafbak'; props: { ldapId: string } }
	| { type: 'LeaderboardGotBeaten'; props: { ldapId: string; yourTime: number; theirTime: number; leaderboardName: string } }
	| { type: 'AdminNoPersonalEmail'; props: { names: string[] } }
	| { type: 'AdminSettingNotFound'; props: { setting: string } }
	| { type: 'AdminError'; props: { error: Error } }
	| { type: 'AdminShitpost'; props: { shitpost: string } }

/**
 * Create a notification
 * @param NotificationPayload: NotificationType and properties associated with that type
 * @param receiverId: User.id for an individual user, 'discord' for global discord message
 */
export async function makeNotification({ type, props }: NotificationPayload, receiverId: number | 'discord'): Promise<void> {
	const template = templates[type]

	if (!template) {
		await notificationFailed(
			new Error(`Template ${type.toString()} niet geimplementeerd`),
			'$lib/server/notifications::makeNotification',
			undefined,
		)
		return
	}

	let data = {
		title: template.title,
		type,
	}

	let user

	if (receiverId === 'discord') {
		data = Object.assign(data, { discord: true })
	} else {
		user = await db.user.findFirst({
			where: {
				id: receiverId,
			},
		})

		if (!user) {
			await notificationFailed(
				new Error(`Gebruiker met id ${receiverId} niet gevonden`),
				'$lib/server/notifications::makeNotification',
				undefined,
			)
			return
		}

		data = Object.assign(data, { userId: user.id })
	}

	const notification = await db.notification.create({ data })

	// Gaat nu nog niet fout, maar zodra er in de toekomst verplichte data wordt toegevoegd kan dit falen.
	if (!notification) {
		await notificationFailed(
			new Error(`$lib/server/db::notification.create failed`),
			'$lib/server/notifications::makeNotification',
			notification,
		)
		return
	}

	if (notification.type.startsWith('Admin')) {
		let text

		switch (type) {
			case 'AdminError':
				text = props.error.message ? props.error.message : props.error.toString()
				break
			case 'AdminNoPersonalEmail':
				text = `Geen persoonlijke email-adres ingesteld voor de volgende gebruikers: ${props.names.join(', ')}`
				break
			case 'AdminSettingNotFound':
				text = `Instelling ${props.setting} niet gevonden!`
				break
			case 'AdminShitpost':
				text = props.shitpost
				break
		}

		const n = await db.notification.update({
			where: {
				id: notification.id,
			},
			data: {
				title: 'IBS Error',
				body: text,
				sent: true,
			},
		})

		await notifyDiscordAdminNotification(n)
		return
	}

	if (notification.discord) {
		let text = ''

		if (type === 'ActivityNew') {
			const a = await db.activity.findFirst({
				where: {
					id: props.id,
				},
			})

			if (!a) {
				await notificationFailed(
					new Error(`Activiteit ${props.id} bestaat niet!`),
					'$lib/server/notifications::makeNotification',
					undefined,
				)
				return
			}

			text = `Nieuwe activiteit: ${a.name}`

			let loc: ActivityLocation | null = null

			if (a?.locationId) {
				loc = await db.activityLocation.findFirst({
					where: {
						id: a?.locationId,
					},
				})
			}

			await db.notification.update({
				where: {
					id: notification.id,
				},
				data: {
					title: `Nieuwe activiteit: ${a.name}`,
					body: a.description,
					sent: true,
				},
			})
			await notifyDiscordActivityNotification(a, 'new', loc)
			return
		} else if (type === 'ActivityChangedDate') {
			const a = await db.activity.findFirst({
				where: {
					id: props.id,
				},
			})

			if (!a) {
				await notificationFailed(
					new Error(`Activiteit ${props.id} bestaat niet!`),
					'$lib/server/notifications::makeNotification',
					undefined,
				)
				return
			}

			await db.notification.update({
				where: {
					id: notification.id,
				},
				data: {
					title: `Datum veranderd: ${a.name}`,
					body: `Datum activiteit '${a.name}' geweizigd: ${props.oldDate} -> ${a.startTime}`,
					sent: true,
				},
			})
			await notifyDiscordActivityNotification(a, 'date-change', null, props.oldDate)
			return
		}

		if (text === '') {
			text = template.text ?? ''
		}

		await db.notification.update({
			where: {
				id: notification.id,
			},
			data: {
				title: template.title,
				body: text,
				failed: true,
			},
		})
		await notificationFailed(
			new Error(
				`notification created, and receiver set to discord, but discord is not implemented for ${type.toString()} with props ${JSON.stringify(props)}`,
			),
			'$lib/server/notifications::makeNotification',
			notification,
		)
		return
	}

	// Now handle emails and templates
	if (!user) {
		await notificationFailed(
			new Error(`Gebruiker met id ${receiverId} niet gevonden`),
			'$lib/server/notifications::makeNotification',
			notification,
		)
		return
	}

	const preference = await getUserNotificationPreference(type, user)

	if (!preference) {
		log(`Skipping notification ${type} to ${user.ldapId} since preference is ${preference}`)
		return
	}

	const feut = await db.committeeMember.findFirst({
		where: {
			userId: user.id,
			committee: {
				ldapId: LDAP_IDS.FEUTEN,
			},
		},
	})

	let extraProps: any = { ...props, ...template.props }
	let subject = notification.title
	let text = 'wolla neef dit moet je wel implementeren he'

	// set props
	switch (type) {
		case 'ActivityChangedDate':
		case 'ActivityNew':
			const a = await db.activity.findFirst({ where: { id: props.id }, include: { location: true } })

			if (!a)
				return await notificationFailed(
					new Error(`Activiteit ${props.id} niet gevonden`),
					`$lib/server/notifications::makeNotification`,
					notification,
				)

			extraProps = Object.assign(extraProps, { activity: a, location: a.location })
			break
		case 'ActivityFillInReminder':
			log(props.ids)
			const as = await db.activity.findMany({
				where: {
					id: {
						in: props.ids,
					},
				},
			})

			if (!as || as.length === 0)
				return await notificationFailed(
					new Error(`Activiteiten ${props.ids} niet gevonden, of ${type} gestuurd met 0 resultaten`),
					`$lib/server/notifications::makeNotification`,
					notification,
				)

			extraProps = Object.assign(extraProps, { activities: as })
			break
		case 'StrafbakNoStrafbak':
			const u = await db.user.findFirst({ where: { ldapId: props.ldapId }, select: { firstName: true } })

			if (!u)
				return await notificationFailed(
					new Error(`Gebruiker ${props.ldapId} niet gevonden.`),
					`$lib/server/notifications::makeNotification`,
					notification,
				)

			extraProps = Object.assign(extraProps, { firstName: user.firstName })
			break
	}

	// set subject
	switch (type) {
		case 'ActivityNew':
			subject = `Nieuwe activiteit: ${extraProps.activity.name}`
			break
		case 'ActivityFillInReminder':
			if (extraProps.activities.length > 0) subject = `Vul je aanwezigheid in!`
			else subject = `Reminder voor invullen: ${extraProps.activities[0].name}`
			break
		case 'ActivityChangedDate':
			subject = `Activiteit verplaatst: ${extraProps.activity.name}`
			break
		case 'StrafbakNoStrafbak':
			subject = `Oei, iemand heeft geen strafbakken meer`
			text = `Oei! ${extraProps.firstName} heeft geen strafbakken meer, doe er wat aan!`
			break
	}

	const emailProps = {
		template: template.template,
		props: {
			user,
			text,
			subject,
			// cast committeeMember object to true or null to false
			isFeut: !!feut,
			...extraProps,
		},
	}

	const html = render(emailProps)

	const plain = render(Object.assign(emailProps, { options: { plainText: true } }))

	const n = await db.notification.update({
		where: {
			id: notification.id,
		},
		data: {
			body: plain,
			title: subject,
		},
	})

	await sendNotificationOverMail(n, html, plain, user)
}

export async function notificationFailed(err: Error, func: string, notification?: Notification) {
	err.message = 'Notificatie niet gelukt: ' + err.message

	if (notification) {
		await db.notification.update({
			where: {
				id: notification.id,
			},
			data: {
				failed: true,
			},
		})
	}

	error(err.message)

	await notifyDiscordErrorNotification(err, func, notification)
}

function log(...obj: any[]) {
	console.log('[Notifications][' + new Date().toISOString() + ']', ...obj)
}

function debug(...obj: any[]) {
	if (process.env.NODE_ENV === 'development') {
		log(obj)
	}
}

function error(...obj: any[]) {
	console.error('[Notifications][' + new Date().toISOString() + ']\n', ...obj)
}
