import type { LayoutServerLoad } from './$types'

export const load = (async event => {
	const currentRoute = event.route
	const user = event.locals.user
	const committees = event.locals.committees
	const roles = event.locals.roles

	return {
		user,
		committees,
		currentRoute,
		roles,
		theme: event.locals.theme,
	}
}) satisfies LayoutServerLoad
