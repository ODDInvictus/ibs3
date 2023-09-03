import { writable } from 'svelte/store'

type ImagePreview = {
  image: string
}

export const imagePreviewStore = writable<ImagePreview>({
  image: ''
})

export function imagePreview(i: ImagePreview) {
  imagePreviewStore.set(i)
}