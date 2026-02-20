import type { RequestEvent } from '@sveltejs/kit'
import type { Activity, ActivityLocation, Notification } from '$lib/server/prisma/client'
import db from '../db'
import { activitySlug } from '$lib/textUtils'

export const notifyDiscordText = async (webhookUrl: string, text: string): Promise<void> => {
	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: text,
		}),
	})
}

const notifyDiscordNotification = async (notification: Notification, webhookUrl: string): Promise<void> => {
	const embed = {
		title: notification.title,
		color: 0xff0000,
		description: notification.body,
		author: {
			name: 'Invictus Bier Systeem',
			url: process.env.ORIGIN,
		},
	}

	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	})
}

export const notifyDiscordActivityNotification = async (
	activity: Activity,
	type: 'new' | 'date-change',
	location: ActivityLocation | null,
	oldDate?: Date,
): Promise<void> => {
	let fields = []
	let embed = {
		description: activity.description,
		color: 0x551b8a,
	}

	const slug = activitySlug(activity.name)

	if (type === 'new') {
		embed.title = `Nieuwe activiteit: ${activity.name}`
		fields.push({
			name: 'Datum',
			value: activity.startTime.toLocaleDateString('nl-NL', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}),
		})

		if (location) {
			fields.push({
				name: 'Locatie',
				value: location.name,
			})
		}

		fields.push({
			name: 'Meer informatie en aanmelden',
			value: `${process.env.ORIGIN}/activiteit/${slug}/${activity.id}`,
		})
	} else {
		embed.title = `Datum veranderd van activiteit: ${activity.name}`

		fields.push(
			...[
				{
					name: 'Oude datum',
					value: oldDate?.toLocaleDateString('nl-NL', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					}),
				},
				{
					name: 'Nieuwe datum',
					value: activity.startTime.toLocaleDateString('nl-NL', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					}),
				},
				{
					name: 'Aanmelding veranderen?',
					value: `${process.env.ORIGIN}/activiteit/${slug}/${activity.id}`,
				},
			],
		)
	}

	embed = Object.assign(embed, { fields })

	const webhookUrl = process.env.DISCORD_IBS_WEBHOOK

	if (!webhookUrl) {
		console.error('DISCORD_IBS_WEBHOOK unset')
		return
	}

	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	})
		.then(r => r.json())
		.then(console.log)
		.catch(console.log)
}

export const notifyDiscordPublicNotification = async (notification: Notification): Promise<void> => {
	const webhookUrl = process.env.DISCORD_IBS_WEBHOOK

	if (!webhookUrl) {
		console.error('DISCORD_IBS_WEBHOOK unset')
		return
	}

	await notifyDiscordNotification(notification, webhookUrl)
}

export const notifyDiscordAdminNotification = async (notification: Notification): Promise<void> => {
	const webhookUrl = process.env.DISCORD_NOTIFICATION_WEBHOOK

	if (!webhookUrl) {
		console.error('DISCORD_NOTIFICATION_WEBHOOK unset')
		return
	}

	await notifyDiscordNotification(notification, webhookUrl)
}

export const notifyDiscordErrorNotification = async (err: Error, func: string, notification?: Notification): Promise<void> => {
	const webhookUrl = process.env.DISCORD_NOTIFICATION_WEBHOOK

	if (!webhookUrl) {
		console.error('DISCORD_NOTIFICATION_WEBHOOK unset')
		console.error(err)
		return
	}

	const embed = {
		title: err.name ?? 'Error',
		color: 0xff0000,
		description: err.message,
		fields: [
			{
				name: 'Functie',
				value: func,
			},
		],
		author: {
			name: 'Invictus Bier Systeem',
			url: process.env.ORIGIN,
		},
		footer: {
			text: new Date().toLocaleString('nl-NL'),
		},
	}

	if (notification) {
		embed['fields'].push({
			name: 'Notificatie type',
			value: notification.type,
		})

		if (notification.userId) {
			const u = await db.user.findFirst({
				where: {
					id: notification.userId,
				},
				select: {
					firstName: true,
				},
			})

			embed['fields'].push({
				name: 'Ontvanger',
				value: u?.firstName!,
			})
		} else {
			embed['fields'].push({
				name: 'Ontvanger',
				value: 'Discord',
			})
		}
	}

	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	})
}

export const notifyDiscordError = async (webhookUrl: string, obj: Record<string, unknown>): Promise<void> => {
	const err = obj.error as Error
	const event = obj.event as RequestEvent<Partial<Record<string, string>>, string | null>

	if (event.url.href?.includes('_app/immutable')) {
		// Skip cache misses
		return
	}

	const embed = {
		title: err.name ?? 'Error',
		color: 0xff0000,
		description: err.message,
		fields: [
			{
				name: 'URL',
				value: event.url.href,
			},
			{
				name: 'User',
				value: event.locals.user?.ldapId ?? 'Niet ingelogd',
			},
		],
		author: {
			name: 'Invictus Bier Systeem',
			url: process.env.ORIGIN,
		},
		footer: {
			text: new Date().toLocaleString('nl-NL'),
		},
	}

	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	})
}
