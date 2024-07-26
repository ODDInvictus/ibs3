import { writable } from 'svelte/store'

type Alert = {
	title: string
	message: string
}

export const alertStore = writable<Alert>({
	title: '',
	message: '',
})

export function alert(c: Alert) {
	alertStore.set(c)
}
