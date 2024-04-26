import { SvelteKitAuth } from '@auth/sveltekit'
import AuthentikProvider from '@auth/core/providers/authentik'
import { env } from '$env/dynamic/private'
import { handleAuthorization } from './authorization'
import { IBSAuthAdapter } from './adapter'
import { redirect } from '@sveltejs/kit'

const {
	handle: handleAuthentication,
	signIn,
	signOut,
} = SvelteKitAuth({
	adapter: IBSAuthAdapter,
	trustHost: true,
	debug: env.DEBUG == 'true',
	secret: env.IBS_CLIENT_SECRET,
	providers: [
		AuthentikProvider({
			clientSecret: env.IBS_CLIENT_SECRET,
			clientId: env.IBS_CLIENT_ID,
			issuer: env.IBS_ISSUER,
		}),
	],
	pages: {
		signIn: '/auth',
		error: '/auth/server-error',
	},
	session: {
		strategy: 'database',
	},
	callbacks: {
		async redirect({ url, baseUrl }) {
			if (url.startsWith('/auth')) {
				throw redirect(303, '/')
			}

			return baseUrl
		},
	},
})

export { handleAuthentication, handleAuthorization, signIn, signOut }
