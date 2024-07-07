import { isAdmin } from '$lib/server/auth'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { newSettingForm } from './form'

export const load = (async ({ locals }) => {
	if (!isAdmin(locals.user)) {
		return error(403, 'Deze pagina is enkel voor administrators')
	}

	await newSettingForm.transform()

	return {
		form: newSettingForm.attributes,
	}
}) satisfies PageServerLoad

export const actions = newSettingForm.actions
