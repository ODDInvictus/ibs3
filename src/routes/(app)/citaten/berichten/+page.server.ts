import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const msgs = await db.discordMessage.findMany({ include: { quotes: true } })
	const users = await db.user.findMany({ select: { firstName: true, discordUsername: true, ldapId: true } })

	return { msgs, users }
}) satisfies PageServerLoad
