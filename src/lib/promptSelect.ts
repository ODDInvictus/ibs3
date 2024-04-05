import { writable } from 'svelte/store'

type PromptSelect = {
	title: string
	message: string
	options: string[] | { key: string; value: string }[]
	cb: (value: string) => Promise<void>
}

export const promptSelectStore = writable<PromptSelect>({
	title: '',
	message: '',
	options: [],
	cb: async () => alert(),
})

export function promptSelect(c: PromptSelect) {
	promptSelectStore.set(c)
}
