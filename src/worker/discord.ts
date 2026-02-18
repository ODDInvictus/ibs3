import { workerDB } from './worker'
import type { Message } from 'discord.js'

export async function parseDiscordMessageIntoQuote(msg: Message) {
	const isProbablyQuote = [...msg.cleanContent].some(l => ["'", '"', '`'].includes(l))

	if (isProbablyQuote) {
		const sender = await workerDB.user.findFirst({
			where: {
				discordUsername: msg.author.username,
			},
		})

		await workerDB.quote.create({
			data: {
				createdAt: msg.createdAt,
				text: msg.cleanContent,
				msgId: msg.id,
				quoterId: sender?.id,
			},
		})
	}
}
