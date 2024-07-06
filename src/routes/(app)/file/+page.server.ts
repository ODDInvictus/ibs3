import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import { uploadGenericFile } from '$lib/server/files'

const schmea = z.object({})

export const load = async ({ locals }) => {
	if (!locals.roles['ibs-admins']) {
		redirect(301, '/')
	}

	const form = await superValidate(schmea)

	return { form }
}

/**
 * Deze pagina is een voorbeeld van een pagina die een bestand upload en superforms gebruikt.
 */

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const form = await superValidate(formData, schmea)
		if (!form.valid) {
			return fail(400, { form })
		}

		// Other fields are accessible in form.data

		const file = formData.get('file') as File

		if (!file || file.size === 0) {
			return fail(400, { form: { ...form, errors: { file: 'No file uploaded' } } })
		}

		const name = await uploadGenericFile(file, locals.user.firstName)

		return { form, name }
	},
} satisfies Actions
