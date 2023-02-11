// @ts-nocheck
import { SvelteKitAuth } from '@auth/sveltekit';
import { IBS_CLIENT_SECRET, IBS_CLIENT_ID, IBS_ISSUER } from '$env/static/private';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import AuthentikProvider from '@auth/core/providers/authentik'
import IBSAdapter from '$lib/server/authAdapter'
import prisma from '$lib/server/db'
import { discordLogger } from '$lib/server/jobs/discord'
import { getUser } from '$lib/server/userCache';



const authorization = async ({ event, resolve }) => {
	const url = event.url.pathname
	const session = await event.locals.getSession()
	const user = await getUser(session)

	event.locals.user = user

	// If the url starts with /jobs, we don't need to check if the user is logged in
	// This route is used by the jobs server to execute jobs
	// This route has to be whitelisted to only allow the jobs server to execute jobs
	// Fix this in NGINX
	if (url.startsWith('/jobs')) {
		// Resolve normally
		return await resolve(event); 
	} else if (!url.startsWith('/auth')) {
		// If the path is something other than /auth, check if the user is logged in
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(303, '/auth');
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


export const handleError = (async ({ error, event }) => {
	// When an error occurs, we want to log it to our logger
	// This is done by sending a request to the jobs server

	let session = {}

	try {
		session = await event.locals.getSession();
	} catch (err) {
		console.log(err)
	}

	await discordLogger.enqueue({ error, event, session })

}) satisfies HandleServerError