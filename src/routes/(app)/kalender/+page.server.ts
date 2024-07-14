import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const today = new Date()
	// If the user is in the members committee, show all events
	const isMember = locals.committees.find(c => c.ldapId === LDAP_IDS.MEMBERS) !== undefined

	const activities = await db.activity.findMany({
		orderBy: [
			{
				startTime: 'asc',
			},
		],
		where: {
			endTime: {
				gte: today,
			},
			membersOnly: !isMember ? false : undefined,
		},
		include: {
			location: {
				select: {
					name: true,
				},
			},
		},
	})

	return {
		activities,
	}
}) satisfies PageServerLoad
