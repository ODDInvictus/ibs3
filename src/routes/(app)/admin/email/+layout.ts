import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load = (async () => {
	error(500, 'De email module wordt nu niet gebruikt')
}) satisfies LayoutLoad
