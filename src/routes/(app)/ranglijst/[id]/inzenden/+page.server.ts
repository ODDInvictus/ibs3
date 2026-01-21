import db from '$lib/server/db'
import { deleteStrafbak } from '$lib/server/strafbakken/index.js'
import type { LeaderboardTypes } from '$lib/server/prisma/client'
import { error, fail, redirect } from '@sveltejs/kit'

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
		type: leaderboard.type as LeaderboardTypes,
		title: leaderboard.name,
	}
}

export const actions = {
	default: async event => {
		const data = await event.request.formData()

		const leaderboardId = event.params.id
		const userId = data.get('user') as string
		const value = data.get('value') as string

		if (!userId) {
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
			const dnf = data.get('dnf')

			let spl = ['0', '-1']

			if (!dnf || dnf === 'off') {
				spl = value.split(':')
			}

			if (spl.length !== 2) {
				return {
					status: 400,
					message: 'Vul een geldige tijd in.',
				}
			}

			const minutes = parseInt(spl[0])
			const seconds = parseInt(spl[1])
			toSave = minutes * 60 + seconds
		} else if (leaderboard.type === 'ADTMEISTER') {
			const dnf = data.get('dnf')
			const seconds = data.get('s') as string
			const miliseconds = data.get('ms') as string

			if (dnf && dnf === 'on') {
				toSave = -1
			} else {
				toSave = Number.parseInt(seconds) * 100 + Number.parseInt(miliseconds)
			}
		} else {
			if (Number.parseInt(value) < 0) {
				return fail(400, {
					message: 'Waarde kan niet negatief zijn.',
				})
			}

			if (Number.parseInt(value) === 0) {
				return fail(400, {
					message: 'Waarde kan niet 0 zijn',
				})
			}
		}

		await db.leaderboardEntry.create({
			data: {
				leaderboardId,
				userId: parseInt(userId),
				value: toSave,
			},
		})

		if (leaderboard.type == 'ADTMEISTER') {
			// #483 - verwijder strafbak als je een nieuwe tijd neerzet op de adtmeister
			await deleteStrafbak(parseInt(userId))
		}

		redirect(303, `/ranglijst/${leaderboardId}`)
	},
}
