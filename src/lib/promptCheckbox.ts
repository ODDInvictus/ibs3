import { writable } from 'svelte/store'

type PromptCheckbox = {
	title: string
	message: string
	value: boolean
	cb: (value: boolean) => Promise<void>
}

export const promptCheckboxStore = writable<PromptCheckbox>({
	title: '',
	message: '',
	value: false,
	cb: async () => alert(),
})

export function promptCheckbox(c: PromptCheckbox) {
	promptCheckboxStore.set(c)
}
