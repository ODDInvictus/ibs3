import { message, superValidate } from 'sveltekit-superforms/server'
import { fail } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'
import { z } from 'zod'
import { db } from '$lib/server/db'
import { isFeut } from '$lib/server/auth/helpers'
import { LDAP_IDS } from '$lib/constants'
import { NotificationType, type Activity } from '$lib/server/prisma/client'
import { deleteFile, uploadPhoto } from '$lib/server/files'
import { activitySlug } from '$lib/textUtils'
import { error, redirect } from '@sveltejs/kit'
import { log } from 'console'
import { makeNotification, makeNotificationForAllUsers } from '$lib/server/notifications'
import { deletePhoto } from '$lib/server/files/disk'

const activitySchema = z
	.object({
		name: z.string().min(3, { message: 'Naam moet mistens 3 karakters lang zijn.' }),
		description: z.string().min(3, { message: 'Beschrijving moet mistens 3 karakters lang zijn.' }),
		location: z.number().default(3),
		committee: z.number().default(7),
		image: z.file().mime(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']).optional(),

		date: z.date(),
		endDate: z.date(),

		membersOnly: z.boolean().default(false),
		noNotification: z.boolean().default(false),
		resetAttending: z.boolean().default(false),
	})
	.refine(data => data.endDate >= data.date, {
		message: 'Activiteit kan niet later beginnen dan eindigen!',
		path: ['date'],
	})

export const load = (async ({ locals, url }) => {
	const edit = !!url.searchParams.get('edit')
	const activity: Activity | undefined = undefined

	let breadcrumb = 'Activiteit aanmaken'
	let form = undefined

	if (edit) {
		const id = url.searchParams.get('id')

		if (!id) {
			throw error(400, 'Probeerde activiteit te bewerken zonder ?id= te setten')
		}

		const a = await db.activity.findFirst({ where: { id: Number.parseInt(id) } })

		if (!a) {
			throw error(500, `Activiteit ${id} bestaat niet`)
		}

		if (new Date() > a.startTime) {
			throw error(500, `Deze activiteit kan niet meer worden bewerkt`)
		}

		breadcrumb = `${a.name} bewerken`

		form = await superValidate(
			{
				name: a.name,
				description: a.description,
				location: a.locationId ?? 3,
				committee: a.committeeId,
				date: a.startTime,
				endDate: a.endTime,
				membersOnly: a.membersOnly,
			},
			zod4(activitySchema),
			{
				id: 'createActivityForm',
			},
		)
	} else {
		form = await superValidate(zod4(activitySchema), {
			id: 'createActivityForm',
		})
	}

	const locations = await db.activityLocation.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			Activity: {
				_count: 'desc',
			},
		},
		where: {
			isActive: true,
		},
	})
	const committees = await db.committee.findMany({
		where: { isActive: true },
		select: { id: true, name: true },
	})

	const feut = isFeut(locals.user)

	return { form, locations, committees, feut, edit, activity, breadcrumb }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData()
		const form = await superValidate(formData, zod4(activitySchema))

		if (!form.valid) return fail(400, { form })

		let aid = 0

		if (url.searchParams.get('edit')) {
			const id = url.searchParams.get('id')
			if (!id) return fail(400, { form, message: '?id= mist' })
			aid = Number.parseInt(id)
			if (!aid) return fail(400, { form, message: '?id= is niet een getal' })

			const oldActivity = await db.activity.findFirst({ where: { id: aid }, include: { activityPhoto: true } })
			if (!oldActivity) return fail(400, { form, message: 'Activiteit met id ' + aid + ' bestaat niet' })

			const oldDate = new Date(oldActivity.startTime.getTime())

			log(`Editing activity ${aid} (${oldActivity.name})`)

			const file = formData.get('image')
			if (file instanceof File && file.size > 0) {
				const photo = await uploadPhoto(file, locals.user.id, false)

				await db.activity.update({
					where: { id: aid },
					data: { activityPhotoId: photo.id },
				})

				// Delete the old photo off disk
				if (oldActivity.activityPhoto) await deletePhoto(oldActivity.activityPhoto)
			}

			await db.activity.update({
				where: {
					id: aid,
				},
				data: {
					name: form.data.name,
					description: form.data.description,
					startTime: form.data.date,
					endTime: form.data.endDate,
					locationId: form.data.location ?? 3,
					membersOnly: form.data.membersOnly,
					committeeId: form.data.committee,
				},
			})

			if (form.data.resetAttending) {
				await db.attending.updateMany({
					where: {
						activityId: aid,
					},
					data: {
						status: 'NO_RESPONSE',
					},
				})
			}

			if (!form.data.noNotification) {
				if (oldDate.getTime() !== form.data.date.getTime()) {
					const payload = { type: NotificationType.ActivityChangedDate, props: { id: aid, oldDate } }
					if (!form.data.membersOnly) {
						await makeNotification(payload, 'discord')
					}
					await makeNotificationForAllUsers(payload, form.data.membersOnly)
				}
			}
		} else {
			try {
				const file = formData.get('image')
				let photo = undefined

				if (file instanceof File && file.size > 0) {
					photo = await uploadPhoto(file, locals.user.id, false)
				}

				await db.$transaction(async tx => {
					const activity = await tx.activity.create({
						data: {
							name: form.data.name,
							description: form.data.description,
							createdById: locals.user.id,
							startTime: form.data.date,
							endTime: form.data.endDate,
							locationId: form.data.location ?? 3,
							membersOnly: form.data.membersOnly,
							committeeId: form.data.committee,
							activityPhotoId: photo?.id,
						},
					})

					aid = activity.id

					// attending
					const users = await tx.user.findMany({
						where: {
							isActive: true,
							CommitteeMember: form.data.membersOnly
								? {
										none: {
											committee: { ldapId: LDAP_IDS.FEUTEN },
										},
									}
								: undefined,
						},
					})

					await tx.attending.createMany({
						data: users.map(u => {
							return { userId: u.id, activityId: activity.id }
						}),
					})
				})

				if (!form.data.noNotification) {
					const payload = { type: NotificationType.ActivityNew, props: { id: aid } }
					if (!form.data.membersOnly) {
						await makeNotification(payload, 'discord')
					}
					await makeNotificationForAllUsers(payload, form.data.membersOnly)
				}
			} catch (err) {
				log(err)
				return message(form, (err as Error).toString(), { status: 500 })
			}
		}

		redirect(303, `/activiteit/${activitySlug(form.data.name)}/${aid}`)
	},
} satisfies Actions
