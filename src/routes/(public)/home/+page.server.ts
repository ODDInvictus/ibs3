import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	if (locals.user) {
		return {
			name: locals.user.firstName,
		}
	}

	return {
		name: null,
	}
}) satisfies PageServerLoad
