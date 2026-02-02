import { redirect, type Handle } from '@sveltejs/kit'
import { getCommittees, getRoles, getUser, getUserTest } from '$lib/server/userCache'
import { env } from '$env/dynamic/private'
import { Setting, settings } from '../settings/settings'

const handleAuthorization = (async ({ event, resolve }) => {
	const url = event.url.pathname

	let user

	// If the environment is test, we can't check for authorization
	if (env.ENVIRONMENT === 'test') {
		const userId = Number(event.cookies.get('testUserId') ?? 1)
		user = await getUserTest(userId)
	} else {
		const session = await event.locals.auth()
		user = await getUser(session)
	}

	const committees = await getCommittees(user)
	const roles = await getRoles(user, committees)

	event.locals.user = user
	// @ts-expect-error Dit wordt geset wanneer de gebruiker inlogd, dus dit is geen probleem
	event.locals.committees = committees
	event.locals.roles = roles

	const themeOverride = settings.getWithoutDefault(Setting.THEME_OVERRIDE)

	if (themeOverride) {
		event.locals.theme = themeOverride
	} else if (import.meta.env.DEV) {
		event.locals.theme = 'dev'
	} else {
		event.locals.theme = user?.preferredTheme ?? 'light'
	}

	// Resolve all routes in /(public) normally
	if (event.route.id?.includes('(public)')) {
		// Resolve normally
		return await resolve(event)
	} else if (!url.startsWith('/auth')) {
		// If the path is something other than /auth, check if the user is logged in

		if (!user) {
			return redirect(303, '/auth')
		}

		if (user.accessDisabled) {
			return redirect(303, '/auth/toegang-geweigerd')
		}
	}

	// If the request is still here, just proceed as normally
	return await resolve(event)
}) satisfies Handle

export { handleAuthorization }
