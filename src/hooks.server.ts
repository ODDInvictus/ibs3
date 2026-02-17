import { env } from '$env/dynamic/private'
import { env as envPublic } from '$env/dynamic/public'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { notifyDiscordError } from '$lib/server/notifications/discord'
import { handleAuthentication, handleAuthorization } from '$lib/server/auth'
import { initAuthHelpers } from '$lib/server/auth'
import { initSettings } from '$lib/server/settings/settings'
import { initAWS } from '$lib/server/notifications/email'

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
	log(error)

	if (env.DISCORD_NOTIFICATION_WEBHOOK) {
		await notifyDiscordError(env.DISCORD_NOTIFICATION_WEBHOOK, { event, error })
	}
}) satisfies HandleServerError

// On start up
await (async () => {
	await initSettings()
	await initAuthHelpers()
	await initAWS()

	// start the service worker
	const worker = new Worker('./src/worker/worker.ts') as Bun.Worker

	worker.addEventListener('open', () => {
		log('Hallo service worker!')
		worker.postMessage('Hallo worker!')
	})

	worker.addEventListener('error', error => {
		log('[IBS3] worker crashed')
		log(error.message)
		// TODO: iets hiermee doen
		process.exit(1)
	})
})()

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[IBS3][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}
