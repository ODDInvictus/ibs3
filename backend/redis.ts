import { createClient } from 'redis'

const client = createClient({
	url: process.env.REDIS_URL ?? 'redis://localhost:6379',
})

client.on('error', err => console.log('[REDIS] Client Error', err))

export default client
