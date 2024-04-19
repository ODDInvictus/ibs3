import { getBirthdaysInOrder } from '$lib/server/birthdays'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		birthdays: await getBirthdaysInOrder(),
	}
}) satisfies PageServerLoad
