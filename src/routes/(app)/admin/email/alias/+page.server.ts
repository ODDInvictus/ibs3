import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const EMAIL_DOMAIN = settings.getOrSkError(Setting.EMAIL_DOMAIN)

	return {
		committeeAliases: await db.emailAliasCommittee.findMany({
			include: { committee: true, alias: true },
		}),
		userAliases: await db.emailAliasUser.findMany({ include: { user: true, alias: true } }),
		customAliases: await db.emailContact.findMany({ include: { EmailAlias: true } }),
		users: await db.user.findMany({
			where: { isActive: true },
			select: { firstName: true, lastName: true, email: true, ldapId: true, nickname: true },
		}),
		domain: EMAIL_DOMAIN,
	}
}) satisfies PageServerLoad
