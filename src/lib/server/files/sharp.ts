import { env } from '$env/dynamic/private'
import { createRedisJob } from '../cache'

export function rotateImage(fileId: number, degrees: number) {
	return createRedisJob('rotate-image', `${fileId},${degrees}`)
}

export async function compressImage(fileId: number, quality: number) {
	return await createRedisJob('compress-image', `${fileId},${quality}`)
}
