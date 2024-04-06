import { get, writable } from 'svelte/store'
import { page } from '$app/stores'

type Breadcrumb = {
	label: string
	href: string
} | null

export const breadcrumbStore = writable<Breadcrumb[]>([])

export function setCustomBreadcrumbs(b: Breadcrumb[]) {
	breadcrumbStore.set(b)
}

export function generateBreadcrumbs(path: string, pathname: string) {
	const tokens = path
		.split('/')
		// Remove zero-length tokens.
		.filter(t => t !== '')
		// Remove (app)
		.filter(t => t !== '(app)')

	const normalTokens = pathname.split('/').filter(t => t !== '')

	let crumbs: Breadcrumb[] = []

	// Create { label, href } pairs for each token.
	let firstDynamicDone = false
	let tokenPath = ''
	crumbs = tokens.map((t, idx) => {
		tokenPath += '/' + t

		if (/\[.*?\]/g.test(t)) {
			// crumb is a dynamic route

			if (firstDynamicDone) {
				// if there are multiple dynamic routes, then do not show the label
				return null
			}

			// Try to use $page.data.title as the label.
			// if that does not exist use the token itself.
			firstDynamicDone = true
			return {
				label: get(page).data.title || normalTokens[idx],
				href: tokenPath,
			}
		}

		return {
			label: t,
			href: tokenPath,
		}
	})

	crumbs = crumbs.filter(c => c !== null)

	// Add a way to get home too.
	crumbs.unshift({ label: 'home', href: '/' })

	setCustomBreadcrumbs(crumbs)
}
