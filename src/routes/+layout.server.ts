import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const currentRoute = event.route
	const user = event.locals.user
	const committees = event.locals.committees
	const roles = event.locals.roles

	return {
		session,
		user,
		committees,
		currentRoute,
		roles
	};
};
