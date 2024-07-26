import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { invalidateUser } from '$lib/server/userCache'
import { uploadPhoto } from '$lib/server/files'

export const load = (async ({ params, locals }) => {
	let id = params.id

	if (id === 'ik') {
		id = locals.user.ldapId
	}

	const member = await db.user.findFirstOrThrow({
		where: {
			ldapId: id,
		},
	})

	const committees = await db.committee.findMany({
		where: {
			CommitteeMember: {
				some: {
					member: {
						ldapId: id,
					},
				},
			},
		},
		select: {
			ldapId: true,
			name: true,
		},
	})

	const isCurrentUser = locals.user.ldapId === member.ldapId

	return {
		member,
		isCurrentUser,
		committees,
		title: member.firstName + ' ' + member.lastName,
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params, locals }) => {
		let id = params.id

		if (id === 'ik') {
			id = locals.user.ldapId
		}

		// save the image and update the user

		const data = Object.fromEntries(await request.formData())

		const file = data.image as File

		if (!file || file.size === 0) {
			return fail(400, { success: false, message: 'Geen foto geupload' })
		}

		const filename = await uploadPhoto(file, locals.user, false)

		await db.user.update({
			where: {
				ldapId: id,
			},
			data: {
				profilePicture: filename,
			},
		})

		invalidateUser(locals.user.email)
	},
} satisfies Actions
