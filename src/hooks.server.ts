// @ts-nocheck
import { SvelteKitAuth } from '@auth/sveltekit';
import { IBS_CLIENT_SECRET, IBS_CLIENT_ID, IBS_ISSUER } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import AuthentikProvider from '@auth/core/providers/authentik'
import IBSAdapter from '$lib/server/authAdapter'
import prisma from '$lib/server/db'


const authorization = async ({ event, resolve }) => {
	const url = event.url.pathname
	// If the path is something other than /auth, check if the user is logged in
	if (!url.startsWith('/auth')) {
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(303, '/auth');
		}

		const user = event.locals.user

		if (!user) {
			const u = await prisma.user.findUnique({ where: { email: session.user.email } })
			if (!u) {
				event.locals.user = user
			}
		}
	}
	
	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	}); 
	return result
}

const options = {
	clientSecret: IBS_CLIENT_SECRET,
	clientId: IBS_CLIENT_ID,
	issuer: IBS_ISSUER,
}

export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [AuthentikProvider(options)],
		adapter: IBSAdapter(prisma),
		secret: IBS_CLIENT_SECRET,
		session: {
			strategy: 'jwt',
		},
	}),
	authorization
)
