import { createRedisJob } from '../cache'

export function rotateImage(fileId: number, degrees: number) {
	return createRedisJob('rotate-image', `${fileId},${degrees}`)
}

export async function compressImage(fileId: number, quality = 90) {
	return await createRedisJob('compress-image', `${fileId},${quality}`)
}
