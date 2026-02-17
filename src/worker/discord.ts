import { db } from '$lib/server/db'
import type { Message } from 'discord.js'

export async function parseDiscordMessageIntoQuote(msg: Message) {
	const isProbablyQuote = [...msg.cleanContent].some(l => ["'", '"', '`'].includes(l))

	if (isProbablyQuote) {
		const sender = await db.user.findFirst({
			where: {
				discordUsername: msg.author.username,
			},
		})

		await db.quote.create({
			data: {
				createdAt: msg.createdAt,
				text: msg.cleanContent,
				msgId: msg.id,
				quoterId: sender?.id,
			},
		})
	}
}
