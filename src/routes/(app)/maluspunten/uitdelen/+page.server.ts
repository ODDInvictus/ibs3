import { maluspuntForm } from './form'

export const load = async ({ locals }) => {
	await maluspuntForm.transform()

	return {
		form: maluspuntForm.attributes,
	}
}

export const actions = maluspuntForm.actions
