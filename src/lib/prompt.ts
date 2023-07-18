import { writable } from 'svelte/store'

type Prompt = {
  title: string
  message: string
  cb: (value: string) => void
}

export const promptStore = writable<Prompt>({
  title: '',
  message: '',
  cb: () => alert(),
})

export function prompt(c: Prompt) {
  promptStore.set(c)
}