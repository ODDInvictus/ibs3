import { env } from '$env/dynamic/private'
import { getOrCreateToken } from '$lib/server/auth'
import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const token = await getOrCreateToken(locals.user, 'calendar')

	const link = env.IBS_URL + '/cal/' + token.token

	return { token, link }
}) satisfies PageServerLoad
