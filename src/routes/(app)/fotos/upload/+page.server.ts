import type { Actions, PageServerLoad } from './$types'
import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import { uploadPhoto } from '$lib/server/files'

export const load = (async () => {
	const users = await db.user.findMany({
		where: {
			isActive: true,
		},
		orderBy: {
			firstName: 'asc',
		},
	})

	return {
		users,
	}
}) satisfies PageServerLoad

type FailType = {
	status: number
	message: string
}

function f(failType: FailType) {
	return fail(
		failType.status,
		Object.assign(
			{
				success: false,
			},
			failType,
		),
	)
}

export const actions = {
	default: async ({ locals, request }) => {
		// We get 1 or more files from the request
		// The browser prevents 0 files from being sent

		const formData = await request.formData()

		const fotos = formData.getAll('fotos') as File[]
		const creator = formData.get('creator') as string
		let name = ''
		let c = locals.user

		if (creator === locals.user.ldapId) {
			name = locals.user.firstName + ' ' + locals.user.lastName
		} else {
			// We know that creator is an user
			const u = await db.user.findFirst({
				where: {
					ldapId: creator,
				},
			})
			if (!u) {
				return f({ status: 400, message: 'Geen gebruiker gevonden' })
			}
			c = u
			name = u.firstName + ' ' + u.lastName
		}

		if (fotos.length === 0) {
			return f({ status: 400, message: 'Geen fotos gevonden' })
		}

		let ids = []

		for (const foto of fotos) {
			const id = await uploadPhoto(foto, c)
			ids.push(id)
		}

		redirect(303, '/fotos/upload/success?ids=' + ids.join(','))
	},
} satisfies Actions
