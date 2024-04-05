import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import type { AttendingStatus } from '@prisma/client'

type RequestType = {
	status: AttendingStatus
	activityId: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { status, activityId }: RequestType = await request.json()
	const user = locals.user

	await db.attending.updateMany({
		where: {
			userId: user.id,
			activityId,
		},
		data: {
			status,
		},
	})

	return new Response('', {
		status: 200,
	})
}
