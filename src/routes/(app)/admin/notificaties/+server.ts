import { db } from '$lib/server/db'
import { notificationNewActivity } from '$lib/server/notifications'
import { RPCHandler, rpcMethod } from '$lib/server/rpc'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = RPCHandler(
	rpcMethod<void>('test', null, async () => {
		const activity = await db.activity.findFirst({ where: { id: 322 } })

		await notificationNewActivity(activity!)
	}),
)
