import { writable } from 'svelte/store'

type Confirm = {
	title: string
	message: string
	cb: (success: boolean) => void
}

export const confirmStore = writable<Confirm>({
	title: '',
	message: '',
	cb: () => alert(),
})

export function confirm(c: Confirm) {
	confirmStore.set(c)
}
