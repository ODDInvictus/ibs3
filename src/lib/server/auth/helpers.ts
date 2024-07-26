import type { User } from '@prisma/client'
import { LDAP_IDS } from '$lib/constants'
import db from '$lib/server/db'

let committeeMembers: any[]

export async function initAuthHelpers() {
	committeeMembers = await db.committeeMember.findMany({
		include: {
			committee: true,
		},
	})
}

export function hasRole(user: User, role: string) {
	const committees = committeeMembers.filter(cm => cm.userId === user.id)

	if (committees.length === 0) return false

	if (committees.find(cm => cm.committee.ldapId === LDAP_IDS.ADMINS)) return true

	const committeeMember = committees.find(cm => cm.committee.ldapId === role)
	return committeeMember !== undefined
}

export function isFinancie(user: User) {
	return hasRole(user, LDAP_IDS.FINANCIE)
}

export function isMember(user: User) {
	return hasRole(user, LDAP_IDS.MEMBERS)
}

export function isAdmin(user: User) {
	return hasRole(user, LDAP_IDS.ADMINS)
}

export function isFeut(user: User) {
	return hasRole(user, LDAP_IDS.FEUTEN)
}
