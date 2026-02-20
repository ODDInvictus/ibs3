import { verifyTokenWithoutUser } from '$lib/server/auth'
import type { RequestHandler } from './$types'
import * as ics from 'ics'
import { isFeut } from '$lib/server/auth/helpers'
import type { Activity } from '$lib/server/prisma/client'
import db from '$lib/server/db'
import { env } from '$env/dynamic/private'
import { activitySlug } from '$lib/textUtils'
import { stripMarkdown } from '$lib/utils'

export const GET: RequestHandler = async ({ locals, params }) => {
	const token = params.token

	if (!token) {
		return fail(400, 'Geen token meegegeven')
	}

	const { valid, user } = await verifyTokenWithoutUser(token, 'calendar')

	if (!valid) {
		return fail(403, 'Token is ongeldig')
	}

	// If the token is valid, respond with the personal calendar for that user
	const activities = await getActivities(isFeut(user!))

	const events = buildEvents(activities)
	const bds = await buildBirthdayEvents()

	return await new Promise((resolve, reject) => {
		ics.createEvents(
			[...events, ...bds],
			{ productId: '//O.D.D. Invictus//Invictus Bier Systeem//NL', method: 'PUBLISH', calName: 'O.D.D. Invictus' },
			(error, value) => {
				if (error) {
					console.error('Het bouwen van de calender voor gebruiker ' + locals.user.ldapId + ' is mislukt', error)
					reject(fail(500, 'Er ging iets mis bij het maken van de kalender'))
				}

				resolve(new Response(value, { status: 200, headers: { 'Content-Type': 'text/calendar' } }))
			},
		)
	})
}

export async function OPTIONS() {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	})
}

const getActivities = async (feut: boolean): Promise<Activity[]> => {
	let activities = []

	if (feut) {
		activities = await db.activity.findMany({
			where: {
				isActive: true,
				membersOnly: false,
			},
			include: {
				location: true,
			},
		})
	} else {
		activities = await db.activity.findMany({
			where: {
				isActive: true,
			},
			include: {
				location: true,
			},
		})
	}

	return activities
}

const buildEvents = (activities: Activity[]): ics.EventAttributes[] => {
	return activities.map(activity => {
		const description = `${activity.description}\n\nMeer informatie: ${env.ORIGIN}/activiteit/${activitySlug(activity.name)}/${activity.id}`

		const title = stripMarkdown(activity.name)

		return {
			start: [
				activity.startTime.getFullYear(),
				activity.startTime.getMonth() + 1,
				activity.startTime.getDate(),
				activity.startTime.getHours(),
				activity.startTime.getMinutes(),
			],
			end: [
				activity.endTime.getFullYear(),
				activity.endTime.getMonth() + 1,
				activity.endTime.getDate(),
				activity.endTime.getHours(),
				activity.endTime.getMinutes(),
			],
			title,
			description,
			url: env.ORIGIN + '/activiteit/' + activity.id,
			uid: `activiteit-${activity.id}@oddinvictus.nl`,
			status: 'CONFIRMED',
			busyStatus: 'BUSY',
			organizer: { name: 'O.D.D. Invictus', email: 'senaat@oddinvictus.nl' },
		}
	})
}

const buildBirthdayEvents = async (): Promise<ics.EventAttributes[]> => {
	// Now add birthdays for all users that are not disabled
	const users = await db.user.findMany({
		where: {
			accessDisabled: false,
		},
	})

	const bds = users
		.map(user => {
			if (!user.birthDate) return null

			const endDate = new Date(user.birthDate.getTime() + 86400000)

			const bd: ics.EventAttributes = {
				title: `${user.firstName} is jarig!`,
				description: `${user.firstName} dit is je verjaardag!`,
				start: [new Date().getFullYear(), user.birthDate.getMonth() + 1, user.birthDate.getDate()],
				end: [new Date().getFullYear(), endDate.getMonth() + 1, endDate.getDate()],
				startInputType: 'local',
				uid: `verjaardag-${user.ldapId}@oddinvictus.nl`,
				recurrenceRule: 'FREQ=YEARLY',
				url: env.ORIGIN + '/leden/' + user.ldapId,
				organizer: { name: 'O.D.D. Invictus', email: 'senaat@oddinvictus.nl' },
			}

			return bd
		})
		.filter(event => event !== null)

	return bds
}

const fail = (code: number, message: string) => {
	return new Response(message, { status: code })
}
