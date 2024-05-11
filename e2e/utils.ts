import type { BrowserContext } from '@playwright/test'

export const userTypes = ['admin', 'colosseum', 'feut', 'financie', 'senaat', 'lid'] as const

export async function setUser(context: BrowserContext, user: (typeof userTypes)[number]) {
	const id = userTypes.indexOf(user) + 1
	if (id === 0) {
		throw new Error(`Error: User type '${user}' is not known. Valid user types are: ${userTypes.join(', ')}`)
	}
	await context.addCookies([
		{
			name: 'testUserId',
			value: id.toString(),
			domain: 'localhost',
			path: '/',
		},
	])
}

export function generateRandomString(length = 7) {
	return Math.random().toString(36).substring(length)
}
