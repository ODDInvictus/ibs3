import { env } from '$env/dynamic/private'
import db from '$lib/server/db'
import { randomSortDay } from '$lib/utils.js'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { LDAP_IDS } from '$lib/constants'
import { redirect } from 'sveltekit-flash-message/server'
import { isSenaat } from '$lib/server/auth/helpers'

export const load = (async event => {
	const { params, locals } = event

	const activity = await db.activity.findFirstOrThrow({
		where: {
			id: parseInt(params.id),
		},
		include: {
			createdBy: {
				select: {
					ldapId: true,
				},
			},
			attending: {
				include: {
					user: true,
				},
			},
			activityPhoto: {
				include: {
					file: true,
				},
			},
			organisedBy: true,
			location: true,
			comments: {
				include: {
					commenter: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							profilePicture: true,
							ldapId: true,
						},
					},
				},
			},
		},
	})

	const isBeproeving = activity.name.toLowerCase().includes('beproeving')

	if (activity.membersOnly && !locals.roles.leden && !isBeproeving) {
		throw redirect(
			'/kalender',
			{
				title: 'Geen toegang',
				message: 'Deze activiteit is alleen toegankelijk voor leden.',
				type: 'danger',
			},
			event,
		)
	}

	if (activity.membersOnly && locals.roles.feuten && isBeproeving) {
		activity.name = 'Leuke activiteit'
		activity.description = 'Hier zal vast allemaal informatie staan, maar dat mag jij helaas niet zien'
		activity.comments = []
	}

	const attending = randomSortDay(activity.attending)

	const isInPast = new Date() > activity.startTime

	return {
		activity,
		attending,
		isInPast,
		title: activity.name,
		domain: env.IBS_URL,
		canEditAttending: isSenaat(locals.user),
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params, locals }) => {
		const reqData = await request.formData()
		const comment = reqData.get('comment')

		if (!comment || comment.length < 1) {
			return f(400, 'Probeer het nog een keertje, ditmaal met tekst!')
		}

		const aid = params.id

		if (!aid || isNaN(Number(aid))) {
			return f(404, 'Activiteit niet gevonden')
		}

		if (locals.roles.feuten) {
			return f(503, 'Feuten mogen geen reactie plaatsen, stuur maar een appje')
		}

		const c = await db.comment.create({
			data: {
				comment: comment as string,
				commenterId: locals.user.id,
				activityId: Number(aid),
			},
			include: {
				commenter: {
					select: {
						id: true,
						firstName: true,
						profilePicture: true,
						lastName: true,
						ldapId: true,
					},
				},
			},
		})

		return {
			message: 'Reactie geplaatst!',
			comment: c,
		}
	},
} satisfies Actions

function f(status: number, message: string) {
	return fail(status, {
		message,
	})
}
