import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const currentRoute = event.route
	const user = event.locals.user

	return {
		session,
		user,
		currentRoute,
	};
};
