import { SvelteKitAuth } from '@auth/sveltekit';
import { env } from '$env/dynamic/private'
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import AuthentikProvider from '@auth/core/providers/authentik'
import IBSAdapter from '$lib/server/authAdapter'
import prisma from '$lib/server/db'
import { getCommittees, getUser } from '$lib/server/userCache';
import { notifyDiscordError } from '$lib/server/notifications/discord';



const authorization = (async ({ event, resolve }) => {
	const url = event.url.pathname
	const session = await event.locals.getSession()
	const user = await getUser(session)
	const committees = await getCommittees(user)

	event.locals.user = user
	event.locals.committees = committees

	// If the url starts with /jobs, we don't need to check if the user is logged in
	// This route is used by the jobs server to execute jobs
	// This route has to be whitelisted to only allow the jobs server to execute jobs
	// Fix this in NGINX
	if (url.startsWith('/jobs')) {
		// Resolve normally
		return await resolve(event); 
	} else if (!url.startsWith('/auth')) {
		// If the path is something other than /auth, check if the user is logged in


		if (!user) {
			throw redirect(303, '/auth');
		}
	}
	
	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	}); 
	return result
}) satisfies Handle

const options = {
	clientSecret: env.IBS_CLIENT_SECRET,
	clientId: env.IBS_CLIENT_ID,
	issuer: env.IBS_ISSUER,
}

export const handle: Handle = sequence(
	SvelteKitAuth({
		trustHost: true,
		providers: [AuthentikProvider(options)],
		adapter: IBSAdapter(prisma),
		secret: env.IBS_CLIENT_SECRET,
		session: {
			strategy: 'jwt',
		},
		callbacks: {
			async redirect({ url, baseUrl }) {
				if (url.startsWith('/auth')) {
					throw redirect(303, '/')
				}

				return baseUrl
			}
		}
	}),
	authorization
)


export const handleError = (async ({ error, event }) => {
	// When an error occurs, we want to log it to our logger
	// This is done by sending a request to the jobs server

	console.error(error)

	await notifyDiscordError(env.DISCORD_NOTIFICATION_WEBHOOK, {event, error})

}) satisfies HandleServerError