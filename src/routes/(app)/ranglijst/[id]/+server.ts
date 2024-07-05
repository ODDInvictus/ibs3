import { isAdmin } from '$lib/server/auth'
import db from '$lib/server/db'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals, params }) => {
	if (await isAdmin(locals.user)) {
		const leaderboard = await db.leaderboard.findUnique({
			where: {
				id: params.id,
			},
		})

		if (!leaderboard) {
			return new Response('Deze ranglijst bestaat niet jonge dikke boktor.', { status: 404 })
		}

		await db.leaderboard.update({
			where: {
				id: params.id,
			},
			data: {
				pinned: !leaderboard.pinned,
			},
		})

		return new Response('Ranglijst is nu ' + !leaderboard.pinned, { status: 200 })
	}

	return new Response('Helaas, dit mogen alleen admins', { status: 403 })
}
