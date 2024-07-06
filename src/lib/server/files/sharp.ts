import { createRedisJob } from '../cache'

export function rotateImage(filename: string, degrees: number) {
	return createRedisJob('rotate-image', `${filename},${degrees}`)
}

export async function compressImage(filename: string, quality = 90) {
	return await createRedisJob('compress-image', `${filename},${quality}`)
}
