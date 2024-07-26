import { env } from '$env/dynamic/private'
import { env as envPublic } from '$env/dynamic/public'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { notifyDiscordError } from '$lib/server/notifications/discord'
import { client as Mongo } from '$lib/server/files'
import { handleAuthentication, handleAuthorization } from '$lib/server/auth'
import { initSettings } from '$lib/server/settings'
import { initAuthHelpers } from '$lib/server/auth'

const handleCors: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/cal')) {
		// Allow CORS for the calendar
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			})
		}
	}
	const res = await resolve(event)

	if (event.url.pathname.startsWith('/cal')) {
		res.headers.append('Access-Control-Allow-Origin', '*')
	}

	return res
}

export const handle: Handle = sequence(handleAuthentication, handleAuthorization, handleCors)

export const handleError = (async ({ error, event }) => {
	// When an error occurs, we want to log it to our logger
	// This is done by sending a request to the jobs server
	console.error(error)

	if (env.DISCORD_NOTIFICATION_WEBHOOK) {
		await notifyDiscordError(env.DISCORD_NOTIFICATION_WEBHOOK, { event, error })
	}
}) satisfies HandleServerError

// On start up
await (async () => {
	await initSettings()
	await initAuthHelpers()

	if (envPublic.PUBLIC_DISABLE_MONGO === 'true') {
		console.log('MongoDB is not connected.')
	} else {
		await Mongo.connect()
		console.log('You successfully connected to MongoDB!')
	}
})()
