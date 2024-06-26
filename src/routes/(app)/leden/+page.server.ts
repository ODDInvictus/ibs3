import { LDAP_IDS } from '$lib/constants'
import db from '$lib/server/db'

export const load = async () => {
	const members = await db.user.findMany({
		where: {
			isActive: true,
			CommitteeMember: {
				some: {
					committee: {
						ldapId: LDAP_IDS.MEMBERS,
					},
				},
			},
		},
		orderBy: {
			firstName: 'asc',
		},
	})

	const feuten = await db.user.findMany({
		where: {
			isActive: true,
			CommitteeMember: {
				some: {
					committee: {
						ldapId: LDAP_IDS.FEUTEN,
					},
				},
			},
		},
		orderBy: {
			firstName: 'asc',
		},
	})

	return {
		members,
		feuten,
	}
}
