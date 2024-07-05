import db from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const users = await db.user.findMany({
		where: {
			isActive: true,
		},
		select: {
			id: true,
			firstName: true,
		},
	})

	const leaderboard = await db.leaderboard.findFirst({
		where: {
			id: params.id,
		},
	})

	if (!leaderboard) {
		error(404, 'Deze ranglijst bestaat niet jonge dikke boktor.')
	}

	return {
		users,
		leaderboard,
		title: leaderboard.name,
	}
}

export const actions = {
	default: async event => {
		const data = await event.request.formData()

		const leaderboardId = event.params.id
		const userId = data.get('user') as string
		const value = data.get('value') as string

		if (!userId || !value) {
			return {
				status: 400,
				message: 'Vul alle velden in.',
			}
		}

		const leaderboard = await db.leaderboard.findFirst({
			where: {
				id: leaderboardId,
			},
		})

		if (!leaderboard) {
			return {
				status: 404,
				message: 'Deze ranglijst bestaat niet jonge dikke boktor.',
			}
		}

		let toSave = parseInt(value)

		if (leaderboard.type === 'TIME') {
			const spl = value.split(':')

			if (spl.length !== 2) {
				return {
					status: 400,
					message: 'Vul een geldige tijd in.',
				}
			}

			const minutes = parseInt(spl[0])
			const seconds = parseInt(spl[1])
			toSave = minutes * 60 + seconds
		}

		await db.leaderboardEntry.create({
			data: {
				leaderboardId,
				userId: parseInt(userId),
				value: toSave,
			},
		})

		redirect(303, `/ranglijst/${leaderboardId}`)
	},
}
