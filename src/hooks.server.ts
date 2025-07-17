import { env } from '$env/dynamic/private'
import { env as envPublic } from '$env/dynamic/public'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle, HandleServerError, ServerInit } from '@sveltejs/kit'
import { notifyDiscordError } from '$lib/server/notifications/discord'
import { client as Mongo } from '$lib/server/files'
import { handleAuthentication, handleAuthorization } from '$lib/server/auth'
import { initAuthHelpers } from '$lib/server/auth'
import { initSettings } from '$lib/server/settings/settings'
import { initBullMQ } from '$lib/server/jobs'
import { building } from '$app/environment'

const handleCors: Handle = async ({ event, resolve }) => {
	const res = await resolve(event)
	res.headers.append('Access-Control-Allow-Origin', '*')
	return res
}

export const handle: Handle = sequence(handleCors, handleAuthentication, handleAuthorization)

export const handleError = (async ({ error, event }) => {
	// When an error occurs, we want to log it to our logger
	// This is done by sending a request to the jobs server
	console.error(error)

	if (env.DISCORD_NOTIFICATION_WEBHOOK) {
		await notifyDiscordError(env.DISCORD_NOTIFICATION_WEBHOOK, { event, error })
	}
}) satisfies HandleServerError

export const init: ServerInit = async () => {
	// voorkom dat sveltekit db connection probeert te maken tijdens buildtime lol
	if (!building) {
		await initSettings()
		await initAuthHelpers()
		await initBullMQ()

		if (envPublic.PUBLIC_DISABLE_MONGO === 'true') {
			console.log('MongoDB is not connected.')
		} else {
			await Mongo.connect()
			console.log('You successfully connected to MongoDB!')
		}
	}
}
