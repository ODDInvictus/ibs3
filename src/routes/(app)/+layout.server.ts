import type { Committee } from '@prisma/client'
import type { LayoutServerLoad } from './$types'
import { LDAP_IDS } from '$lib/constants'
import { loadFlash } from 'sveltekit-flash-message/server'

export const load = loadFlash(async ({ locals }) => {
	const topRole = getTopRole(locals.committees)
	return { topRole }
}) satisfies LayoutServerLoad

const ranking = [LDAP_IDS.FEUTEN, LDAP_IDS.SENAAT, LDAP_IDS.ADMINS, LDAP_IDS.FINANCIE, LDAP_IDS.COLOSSEUM, LDAP_IDS.MEMBERS]

function getTopRole(committees: Committee[]) {
	// Get the best committee where ldapId is lowest in the ranking
	let topIdx = ranking.length - 1
	let topCommittee = committees[topIdx]
	for (const c of committees) {
		const index = ranking.indexOf(c.ldapId)
		if (index === -1) continue
		if (index < topIdx) {
			topIdx = index
			topCommittee = c
		}
	}

	switch (topCommittee?.ldapId) {
		case LDAP_IDS.FEUTEN:
			return 'Feut'
		case LDAP_IDS.SENAAT:
			return 'Senaat'
		case LDAP_IDS.ADMINS:
			return 'Admin'
		case LDAP_IDS.FINANCIE:
			return 'FinanCie'
		case LDAP_IDS.COLOSSEUM:
			return 'Colosseum-bewoner'
		case LDAP_IDS.MEMBERS:
			return 'Lid'
		default:
			return 'Lid'
	}
}
