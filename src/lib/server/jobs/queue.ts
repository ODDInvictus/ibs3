import { env } from '$env/dynamic/private'
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const redis = new Redis({
	port: Number(env.REDIS_PORT ?? 6379),
	host: env.REDIS_HOST ?? 'localhost',
	maxRetriesPerRequest: 0,
})

const QUEUE_NAME = 'ibs3_queue'

const JobQueue = new Queue(QUEUE_NAME, {
	connection: redis,
})

export const initBullMQ = async () => {
	new Worker(
		QUEUE_NAME,
		async job => {
			// doe iets
			console.log('job!')
			console.log(job.name)
		},
		{ connection: redis },
	)
}
