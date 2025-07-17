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
	let str = stripMarkdown(activityName)

	//https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n
	str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
	str = str.toLowerCase() // convert string to lowercase
	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/-+/g, '-') // remove consecutive hyphens

	return str
}
