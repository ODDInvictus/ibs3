import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { authorization } from '$lib/ongeveer/utils'

export const load = (async ({ locals }) => {
	if (!authorization(locals.roles)) error(403, 'Alleen senaat en financie kunnen deze pagina zien')
}) satisfies LayoutServerLoad
