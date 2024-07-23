import { prisma } from './prisma'

export function randomString(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''

	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}

	return result
}

export async function failJob(jobName: string, error: string) {
	return await prisma.job.update({
		where: {
			name: jobName,
		},
		data: {
			finished: false,
			completedAt: new Date(),
			result: error,
		},
	})
}
