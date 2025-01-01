import db from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { LDAP_IDS } from '$lib/constants.js'
import { z } from 'zod'
import { pad } from '$lib/utils.js'
import type { PageServerLoad } from './$types.js'
import { createRedisJob } from '$lib/server/cache.js'
import { uploadPhoto } from '$lib/server/files'

export const load = (async ({ url, locals }) => {
	const locations = await db.activityLocation.findMany({
		where: {
			isActive: true,
		},
	})

	const edit = url.searchParams.get('edit')

	const committees = await db.committee.findMany({
		where: {
			isActive: true,
		},
	})

	if (edit === 'true') {
		// Load up all the values
		const id = url.searchParams.get('id')

		if (id) {
			const activity = await db.activity.findUnique({
				where: {
					id: parseInt(id),
				},
				include: {
					location: true,
					organisedBy: true,
				},
			})

			if (activity) {
				// Split the date and time
				const startDate = activity.startTime.toISOString().split('T')[0]
				const startTime = pad(activity.startTime.getHours()) + ':' + pad(activity.startTime.getMinutes())
				const endDate = activity.endTime.toISOString().split('T')[0]
				const endTime = pad(activity.endTime.getHours()) + ':' + pad(activity.endTime.getMinutes())

				return {
					edit: true,
					activity,
					times: {
						startDate,
						startTime,
						endDate,
						endTime,
					},
					committees: committees,
					locations,
				}
			}
		}
	}

	return {
		locations,
		committees,
	}
}) satisfies PageServerLoad

const validateDate = (date: string) => {
	const d = new Date(date)
	return !isNaN(d.getTime())
}

const validateTime = (time: string) => {
	const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
	return time.match(timeReg)
}

const formSchema = z.object({
	name: z
		.string({
			required_error: 'Naam is verplicht',
			invalid_type_error: 'Naam moet een string zijn',
		})
		.min(3, { message: 'Naam moet minimaal 3 karakters lang zijn' }),
	description: z
		.string({ required_error: 'Beschrijving is verplicht' })
		.min(3, { message: 'Beschrijving moet minimaal 3 karakters lang zijn' }),
	startDate: z
		.string({
			required_error: 'Begin datum is verplicht',
			invalid_type_error: 'Begin datum moet een datum zijn',
		})
		.refine(validateDate),
	startTime: z
		.string({
			required_error: 'Begin tijd is verplicht',
			invalid_type_error: 'Begin tijd moet een tijdstip zijn',
		})
		.refine(validateTime, { message: 'Begin tijd is niet valide' }),
	endDate: z
		.string({
			required_error: 'Eind datum is verplicht',
			invalid_type_error: 'Eind datum moet een datum zijn',
		})
		.refine(validateDate),
	endTime: z
		.string({
			required_error: 'Eind tijd is verplicht',
			invalid_type_error: 'Eind tijd moet een tijdstip zijn',
		})
		.refine(validateTime, { message: 'Eind tijd is niet valide' }),
	location: z
		.string({ invalid_type_error: 'LocatieID is onjuist' })
		.refine(val => {
			const num = parseInt(val)
			return !isNaN(num)
		})
		.optional(),
	organisedBy: z.string({ invalid_type_error: 'CommissieID is onjuist' }).refine(val => {
		const num = parseInt(val)
		return !isNaN(num) && num > 0
	}),
	url: z.string().url({ message: 'URL is niet valide' }).or(z.literal('')),
	image: z.any(),
	membersOnly: z.string().optional(),
})

export const actions = {
	default: async event => {
		const data = Object.fromEntries(await event.request.formData())

		const edit = event.url.searchParams.get('edit') === 'true'
		const editId = event.url.searchParams.get('id')

		const zodData = formSchema.safeParse(data)

		if (!zodData.success) {
			// Loop through the errors array and create a custom errors array
			const errors = zodData.error.errors.map(error => {
				return {
					field: error.path[0],
					message: error.message,
				}
			})

			return fail(400, { error: true, errors })
		}

		const { name, description, startDate, startTime, endDate, endTime, location, organisedBy, url, image, membersOnly } = zodData.data

		const start = new Date(`${startDate} ${startTime}`)
		const end = new Date(`${endDate} ${endTime}`)

		if (start > end) {
			return fail(400, {
				error: true,
				errors: [{ field: 'endDate', message: 'Eind datum moet na de begin datum zijn' }],
			})
		}

		let id = 0

		try {
			await db.$transaction(async tx => {
				// first create the activity

				let loc = null

				if (location && parseInt(location) > 0) {
					loc = parseInt(location)
				}

				let activity

				if (edit && editId) {
					// Update the activity
					activity = await tx.activity.update({
						where: {
							id: parseInt(editId),
						},
						data: {
							name,
							description,
							startTime: start,
							endTime: end,
							locationId: loc,
							membersOnly: membersOnly ? membersOnly === 'on' : false,
							committeeId: parseInt(organisedBy),
							url: url ?? null,
						},
					})
				} else {
					activity = await tx.activity.create({
						data: {
							name,
							description,
							createdById: event.locals.user.id,
							startTime: start,
							endTime: end,
							locationId: loc,
							membersOnly: membersOnly === 'on',
							committeeId: parseInt(organisedBy),
							url: url ?? null,
						},
					})
				}

				id = activity.id
				let shortLink = `activiteit-${id}-info`

				if (url) {
					await tx.link.upsert({
						where: {
							shortLink,
						},
						update: {
							link: url,
							userId: event.locals.user.id,
						},
						create: {
							shortLink,
							link: url,
							userId: event.locals.user.id,
						},
					})

					await tx.activity.update({
						where: {
							id,
						},
						data: {
							url: `${env.IBS_URL}/s/${shortLink}`,
						},
					})
				}

				if (image.size > 0) {
					const filename = await uploadPhoto(image, event.locals.user, false)

					await tx.activity.update({
						where: {
							id: activity.id,
						},
						data: {
							photo: filename,
						},
					})
				}

				// Create all attending objects

				// To do that: get all members + feuten
				// and if membersOnly is set, then exclude the feuten\
				if (!edit) {
					const users = await tx.user.findMany({
						where: {
							isActive: true,
							CommitteeMember: membersOnly
								? {
										none: {
											committee: { ldapId: LDAP_IDS.FEUTEN },
										},
									}
								: undefined,
						},
					})

					const attending = users.map(user => {
						return {
							userId: user.id,
							activityId: activity.id,
						}
					})

					// Create all attending objects!
					await tx.attending.createMany({
						data: attending,
					})
				}
			})

			if (!edit) {
				// Now, we notify everyone
				console.log('[Activity/new] Notifying everyone')
				await createRedisJob('new-activity', '' + id)
			}
		} catch (e) {
			console.error(e)
			return fail(500, {
				error: true,
				message: 'Er ging iets mis bij het opslaan van de activiteit',
			})
		}

		if (id !== 0) {
			redirect(303, `/activiteit/${id}`)
		}
	},
}
