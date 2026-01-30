import { db } from '$lib/server/db'
import { makeNotification } from '$lib/server/notifications'
import { RPCHandler, rpcMethod } from '$lib/server/rpc'
import * as z from 'zod'
import type { RequestHandler } from './$types'
import { NotificationType } from '$lib/server/prisma/enums'

type Body = {
	selection: string
	discord: boolean
}

export const POST: RequestHandler = RPCHandler(
	rpcMethod<Body, void>('test', z.object({ selection: z.string(), discord: z.boolean() }), async (body, user) => {
		const nt = NotificationType[body.selection as keyof typeof NotificationType]

		console.log(`Selected ${nt} ${body.discord}`)

		let props = undefined

		const a = await db.activity.findFirst({
			orderBy: {
				id: 'desc',
			},
		})

		switch (nt) {
			case NotificationType.ActivityFillInReminder:
				props = { ids: [a!.id] }
				break
			case NotificationType.ActivityNew:
				props = { id: a!.id }
				break
			case NotificationType.ActivityChangedDate:
				props = { id: a!.id, oldDate: a!.startTime }
				break
			case NotificationType.StrafbakCreate:
				props = { giverLdapId: user.ldapId }
				break
			case NotificationType.StrafbakMaster:
			case NotificationType.StrafbakNoStrafbak:
				props = { ldapId: user.ldapId }
				break
			case NotificationType.LeaderboardGotBeaten:
				props = { ldapId: user.ldapId, yourTime: 7000, theirTime: 4400, leaderboardName: 'Adtmeister: 20cl' }
				break
			case NotificationType.AdminNoPersonalEmail:
				props = { names: [user.ldapId] }
				break
			case NotificationType.AdminSettingNotFound:
				props = { setting: 'Test' }
				break
			case NotificationType.AdminError:
				props = { error: Error('Test') }
				break
			case NotificationType.AdminShitpost:
				props = { shitpost: 'Shitpost' }
				break
			default:
				props = undefined
				break
		}

		await makeNotification({ type: nt, props } as any, body.discord ? 'discord' : user.id)
	}),
)
