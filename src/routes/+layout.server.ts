import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const user = event.locals.user
	const committees = event.locals.committees

	return {
		session,
		user,
		committees,
	};
};
