import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'
import type { Activity } from '$lib/server/prisma/client'
import type { PageServerLoad } from './$types'

type CalendarActivity = Activity & {
	isDies: boolean
}

export const load = (async ({ locals }) => {
	const today = new Date()
	// If the user is in the members committee, show all events
	const isMember = locals.committees.find(c => c.ldapId === LDAP_IDS.MEMBERS) !== undefined

	const activityQuery = await db.activity.findMany({
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
			activityPhoto: {
				include: {
					file: {
						select: {
							filename: true,
						},
					},
				},
			},
		},
	})

	let activities = activityQuery.map(activity => {
		const isDies = activity.name.toLowerCase().includes('dies')
		return {
			...activity,
			isDies,
		}
	})

	return {
		activities,
	}
}) satisfies PageServerLoad
