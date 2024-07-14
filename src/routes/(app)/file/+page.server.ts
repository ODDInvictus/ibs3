import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import { uploadGenericFile, uploadPhoto } from '$lib/server/files'
import { isAdmin } from '$lib/server/auth'

const schema = z.object({
	isPhoto: z.boolean().default(false),
})

export const load = async ({ locals }) => {
	if (!isAdmin(locals.user)) {
		redirect(300, '/')
	}

	const form = await superValidate(schema)

	return { form }
}

/**
 * Deze pagina is een voorbeeld van een pagina die een bestand upload en superforms gebruikt.
 */

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const form = await superValidate(formData, schema)
		if (!form.valid) {
			return fail(400, { form })
		}

		// Other fields are accessible in form.data

		const file = formData.get('file') as File
		const isPhoto = form.data.isPhoto

		if (!file || file.size === 0) {
			return fail(400, { form: { ...form, errors: { file: 'No file uploaded' } } })
		}

		let name = ''

		try {
			if (isPhoto) {
				console.log('[FilePage] Uploading photo')
				name = await uploadPhoto(file, locals.user, false)
			} else {
				console.log('[FilePage] Uploading generic file')
				name = await uploadGenericFile(file, locals.user)
			}
		} catch (e) {
			console.error('[FilePage] Error uploading file:', e)
			return fail(500, { message: e.message })
		}
		return { form, name }
	},
} satisfies Actions
