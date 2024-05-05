import Redis from 'ioredis'
import { env } from '$env/dynamic/private'

const redis = new Redis({
	port: Number(env.REDIS_PORT ?? 6379),
	host: env.REDIS_HOST ?? 'localhost',
	maxRetriesPerRequest: 3,
	lazyConnect: true,
	retryStrategy: times => {
		if (times % 4 == 0) {
			return null
		}
		return 200
	},
})

export default redis

type RedisJobKeys = 'photo-processing' | 'new-activity' | 'unknown' | 'compress-image' | 'rotate-image'

export const createRedisJob = async (key: RedisJobKeys, data?: string) => {
	if (env.DISABLE_REDIS === 'true') {
		console.log('[REDIS] Redis is disabled, jobs will not be processed')
		return
	}

	console.log('[REDIS] Creating job of type', key)
	await redis.publish(
		key,
		JSON.stringify({
			data: data ?? '',
			date: Date.now(),
			type: key,
		}),
	)
}
