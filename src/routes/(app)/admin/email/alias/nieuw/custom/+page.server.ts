import { Setting, settings } from '$lib/server/settings'
import { error } from 'console'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const EMAIL_DOMAIN = settings.getOrSkError(Setting.EMAIL_DOMAIN)

	return {
		domain: EMAIL_DOMAIN,
	}
}) satisfies PageServerLoad
