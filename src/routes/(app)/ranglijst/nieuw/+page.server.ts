import { newScoreboardForm } from './form'

export const load = async () => {
	await newScoreboardForm.transform()

	return {
		form: newScoreboardForm.attributes,
	}
}

export const actions = newScoreboardForm.actions
