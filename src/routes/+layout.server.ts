import { Setting, settings } from '$lib/server/settings/settings'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = event => {
	const currentRoute = event.route
	const user = event.locals.user
	const committees = event.locals.committees
	const roles = event.locals.roles
	const version = settings.get(Setting.VERSION, '0.0.0')

	return {
		user,
		committees,
		currentRoute,
		roles,
		version,
		theme: event.locals.theme,
	}
}
