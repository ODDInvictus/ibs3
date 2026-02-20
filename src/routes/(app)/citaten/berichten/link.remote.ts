import { command } from '$app/server'
import { db } from '$lib/server/db'
import { z } from 'zod'

type CommandType = {
	ldapId: string
	discordUsername: string
}

const val = z.object({
	ldapId: z.string().min(3),
	discordUsername: z.string().min(3),
})

export const linkDiscordUser = command(val, async ({ ldapId, discordUsername }: CommandType) => {
	await db.user.updateMany({
		where: {
			discordUsername,
		},
		data: {
			discordUsername: '',
		},
	})

	await db.user.update({
		where: {
			ldapId,
		},
		data: {
			discordUsername,
		},
	})
})
