import type Decimal from 'decimal.js'
import { stripMarkdown } from './utils'

export function formatPrice(price: number | Decimal): string {
	return Number(price).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

export function getSlug(id: number, title: string): string {
	return '' + id + '-' + title.toLowerCase().replace(/ /g, '-')
}

export function prettySlug(slug: string): string {
	return slug.replace(/-/g, ' ')
}

export function mergeClassNames(...classNames: string[]): string {
	if (classNames.length === 0) return ''
	if (classNames.length === 1) return classNames[0]
	return classNames.join(' ')
}

export function activitySlug(activityName: string) {
	let md = stripMarkdown(activityName)

	// This adds a space to the end, remove it
	md = md.replace(/ $/g, '')
	// remove all : and . characters
	md = md.replace(/[:.]/g, '')

	return md.toLowerCase().replace(/ /g, '-')
}
