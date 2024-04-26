import { redirect, type Handle } from '@sveltejs/kit'
import prisma from '$lib/server/db'
import { getCommittees, getRoles, getUser, getUserTest } from '$lib/server/userCache'
import { env } from '$env/dynamic/private'

const handleAuthorization = (async ({ event, resolve }) => {
	const url = event.url.pathname

	let user

	// If the environment is test, we can't check for authorization
	if (env.NODE_ENV === 'test') {
		const userId = Number(env.TEST_USER_ID ?? 1)
		user = await getUserTest(userId)
	} else {
		const session = await event.locals.auth()
		user = await getUser(session)
	}

	const committees = await getCommittees(user)
	const roles = await getRoles(user, committees)

	// @ts-expect-error Dit wordt geset wanneer de gebruiker inlogd, dus dit is geen probleem
	event.locals.user = user
	// @ts-expect-error Dit wordt geset wanneer de gebruiker inlogd, dus dit is geen probleem
	event.locals.committees = committees
	event.locals.roles = roles

	event.locals.theme = env.THEME_OVERRIDE ?? user?.preferredTheme ?? 'light'

	// If shortner, then ignore auth.
	if (url.startsWith('/s/')) {
		// Resolve normally
		return await resolve(event)
	} else if (!url.startsWith('/auth')) {
		// If the path is something other than /auth, check if the user is logged in

		if (!user) {
			throw redirect(303, '/auth')
		}

		if (user.accessDisabled) {
			throw redirect(303, '/auth/toegang-geweigerd')
		}
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html,
	})
	return result
}) satisfies Handle

export { handleAuthorization }
