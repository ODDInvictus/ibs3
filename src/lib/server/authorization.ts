import type { User } from '@prisma/client'
import { LDAP_IDS } from '$lib/constants'
import db from '$lib/server/db'

export async function hasRole(user: User, role: string) {
	const committeeMembers = await db.committeeMember.findMany({
		where: {
			userId: user.id,
		},
		include: {
			committee: true,
		},
	})

	// return true is Admin or has the role
	return committeeMembers.some(cm => cm.committee.ldapId === LDAP_IDS.ADMINS) || committeeMembers.some(cm => cm.committee.ldapId === role)
}

export async function isFinancie(user: User) {
	return await hasRole(user, LDAP_IDS.FINANCIE)
}

export async function isSenate(user: User) {
	return await hasRole(user, LDAP_IDS.SENAAT)
}
