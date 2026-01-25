import { env } from '$env/dynamic/private'
import { env as envPublic } from '$env/dynamic/public'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { notifyDiscordError } from '$lib/server/notifications/discord'
import { client as Mongo } from '$lib/server/files'
import { handleAuthentication, handleAuthorization } from '$lib/server/auth'
import { initAuthHelpers } from '$lib/server/auth'
import { initSettings } from '$lib/server/settings/settings'
import { initAWS } from '$lib/server/notifications/email'
import { work } from './worker/worker'

const handleCors: Handle = async ({ event, resolve }) => {
	const res = await resolve(event)

	if (env.ORIGIN) {
		res.headers.append('Access-Control-Allow-Origin', env.ORIGIN)
	} else {
		res.headers.append('Access-Control-Allow-Origin', '*')
	}
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

// On start up
await (async () => {
	await initSettings()
	await initAuthHelpers()
	await initAWS()

	if (envPublic.PUBLIC_DISABLE_MONGO === 'true') {
		console.log('MongoDB is not connected.')
	} else {
		await Mongo.connect()
		console.log('You successfully connected to MongoDB!')
	}

	// start the service worker
	if (env.WORKER_ON_MAIN_THREAD) {
		console.log('Starting worker on main thread')
		setInterval(async () => await work(), 10 * 1000)
	} else {
		console.log('Starting service worker')
		const worker = new Worker('./src/worker/worker.ts', {
			smol: true,
		}) as Bun.Worker

		worker.postMessage('Hallo vanaf ibs3')
	}
})()
