import { newCommitteeForm } from './form'

export const load = async () => {
	await newCommitteeForm.transform()

	return {
		form: newCommitteeForm.attributes,
	}
}

export const actions = newCommitteeForm.actions
