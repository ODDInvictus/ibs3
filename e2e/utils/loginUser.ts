import { BrowserContext } from '@playwright/test'
import sessionTokens from '../sessionTokens.json' assert { type: 'json' }

type userTypes = 'admin' | 'colosseum' | 'feut' | 'financie' | 'senaat' | 'lid'

export function loginTestUser(context: BrowserContext, userType: userTypes) {
	return context.addCookies([
		{
			name: 'next-auth.session-token',
			value: sessionTokens[userType],
			path: '/',
			domain: 'localhost',
			expires: -1,
		},
	])
}
