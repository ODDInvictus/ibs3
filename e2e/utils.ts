import { BrowserContext } from '@playwright/test'

export const userTypes = ['admin', 'colosseum', 'feut', 'financie', 'senaat', 'lid'] as const

export async function setUser(context: BrowserContext, user: (typeof userTypes)[number]) {
	await context.addCookies([
		{
			name: 'testUserId',
			value: (userTypes.findIndex(x => x == user) + 1).toString(),
			domain: 'localhost',
			path: '/',
		},
	])
}
