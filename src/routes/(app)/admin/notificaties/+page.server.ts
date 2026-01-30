import { NotificationType } from '$lib/server/prisma/enums'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	if (!import.meta.env.DEV) error(400, 'Hallo dit is een dev pagina wolla neef')

	return {
		nts: Object.values(NotificationType),
	}
}) satisfies PageServerLoad
