import { maluspuntForm } from './form'

let form = maluspuntForm

;(async () => {
	await form.transform()
})()

export const load = async ({ locals }) => {
	return {
		form: form.attributes,
	}
}

export const actions = form.actions
