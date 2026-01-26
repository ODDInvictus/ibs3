import type { RequestEvent } from '@sveltejs/kit'

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

export const notifyDiscordErrorPlain = async (err: Error, func: string): Promise<void> => {
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
				name: 'Function',
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
				value: event.locals.user?.email ?? 'Niet ingelogd',
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
