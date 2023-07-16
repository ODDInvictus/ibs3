import { writable } from 'svelte/store'

type PromptSelect = {
  title: string
  message: string
  options: string[]
  cb: (value: string) => void
}

export const promptSelectStore = writable<PromptSelect>({
  title: '',
  message: '',
  options: [],
  cb: () => alert(),
})

export function promptSelect(c: PromptSelect) {
  promptSelectStore.set(c)
}