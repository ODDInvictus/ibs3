import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'
import { error } from 'console'

export const load = (async () => {
	const EMAIL_DOMAIN = settings.getOrSkError(Setting.EMAIL_DOMAIN)

	return {
		domain: EMAIL_DOMAIN,
		users: await db.user.findMany({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				ldapId: true,
			},
		}),
	}
}) satisfies PageServerLoad
