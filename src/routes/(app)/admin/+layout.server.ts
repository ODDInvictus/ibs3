import type { Committee } from '@prisma/client'
import type { LayoutServerLoad } from './$types'
import { LDAP_IDS } from '$lib/constants'
import { error } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	if (!locals.committees.find(c => c.ldapId === LDAP_IDS.ADMINS || c.ldapId === LDAP_IDS.SENAAT)) {
		error(401, 'Trek bak')
	}
}) satisfies LayoutServerLoad
