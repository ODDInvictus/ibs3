import type { Actions, PageServerLoad } from './$types'
import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import { uploadPhoto } from '$lib/server/files'
import type { User } from '@prisma/client'

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
		let c: User = locals.user

		if (creator) {
			const user = await db.user.findFirst({
				where: {
					ldapId: creator,
				},
			})

			if (!user) {
				return f({ status: 400, message: 'Geen gebruiker gevonden' })
			}

			c = user
		}

		if (fotos.length === 0) {
			return f({ status: 400, message: 'Geen fotos gevonden' })
		}

		let ids: string[] = []

		for (const foto of fotos) {
			const id = await uploadPhoto(foto, c, true, true, c)
			ids.push(id)
		}

		redirect(303, '/fotos/upload/success?ids=' + ids.join(','))
	},
} satisfies Actions
