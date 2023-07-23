import { writable } from 'svelte/store'

type Prompt = {
  title: string
  message: string
  cb: (value: string) => Promise<void>
}

export const promptStore = writable<Prompt>({
  title: '',
  message: '',
  cb: async () => alert(),
})

export function prompt(c: Prompt) {
  promptStore.set(c)
}