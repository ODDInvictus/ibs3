import { env } from '$env/dynamic/private'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { notifyDiscordError } from '$lib/server/notifications/discord'
import { Decimal } from 'decimal.js'
import { client as Mongo } from '$lib/server/files'
import { handleAuthentication, handleAuthorization } from '$lib/server/auth'
import { initSettings } from '$lib/server/settings'
import { initAuthHelpers } from '$lib/server/auth'

export const handle: Handle = sequence(handleAuthentication, handleAuthorization)

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
	Decimal.set({ precision: 4 })

	await initSettings()
	await initAuthHelpers()

	if (env.DISABLE_MONGO === 'true') {
		console.log('MongoDB is not connected.')
	} else {
		await Mongo.connect()
		console.log('You successfully connected to MongoDB!')
	}
})()
