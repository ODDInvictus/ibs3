import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'
import type { Activity } from '$lib/server/prisma/client'
import type { PageServerLoad } from './$types'

type CalendarActivity = Activity & {
	isDies: boolean
}

export const load = (async ({ locals }) => {
	const today = new Date()

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

	// filter alle niet beproeving activiteiten weg voor feuten
	let activities = activityQuery.filter(a => {
		if (locals.roles.leden) {
			return true
		}

		if (!a.membersOnly) {
			return true
		}

		if (a.membersOnly && a.name.toLowerCase().includes('beproeving') && locals.roles.feuten) {
			return true
		}
		return false
	})

	activities = activities.map(activity => {
		let isDies = activity.name.toLowerCase().includes('dies')

		if (activity.membersOnly && locals.roles.feuten) {
			isDies = false
			activity.name = 'Leuke activiteit'
			activity.description = 'Feutjes zijn zeker welkom, maar jullie zien vanzelf wel wat er gaat gebeuren'
		}

		return {
			...activity,
			isDies,
		}
	})

	return {
		activities,
	}
}) satisfies PageServerLoad
