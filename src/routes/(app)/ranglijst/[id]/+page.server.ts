import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ params, locals }) => {
	if (params.id === 'naut') {
		await db.strafbak.create({
			data: {
				receiver: {
					connect: {
						id: locals.user.id,
					},
				},
				reason: 'Lol je bent gememed door de ranglijsten',
				location: 'Ranglijst haha',
			},
		})

		return error(500, 'Sorry man, Naut is geen ranglijst. Ik heb je hiervoor een strafbakje gegeven.')
	}

	const scoreboard = await db.leaderboard.findUnique({
		where: {
			id: params.id,
		},
	})

	if (!scoreboard) {
		return error(404, 'Deze ranglijst bestaat niet jonge dikke boktor.')
	}

	let entries: { id: number; name: string; value: number }[] = []

	if (scoreboard.type === 'COUNT') {
		const query = await db.user.findMany({
			select: {
				firstName: true,
				id: true,
				LeaderboardEntry: {
					where: {
						leaderboardId: scoreboard.id,
					},
				},
			},
		})

		const q = query
			.map(user => {
				if (user.LeaderboardEntry.length === 0) {
					return undefined
				}

				let score = 0
				for (const entry of user.LeaderboardEntry) {
					score += entry.value
				}

				return {
					id: user.id,
					name: user.firstName,
					value: score,
				}
			})
			.filter(entry => entry !== undefined)
			.sort((a, b) => {
				if (scoreboard.sortBy === 'ASC') {
					// @ts-ignore kan gewoon, zie .filter
					return a.value - b.value
				} else {
					// @ts-ignore idem dito
					return b.value - a.value
				}
			})

		entries = q as { id: number; name: string; value: number }[]
	} else {
		const query = await db.leaderboardEntry.findMany({
			where: {
				leaderboardId: scoreboard.id,
			},
			select: {
				user: {
					select: {
						firstName: true,
						id: true,
					},
				},
				value: true,
			},
			orderBy: {
				value: scoreboard.sortBy === 'ASC' ? 'asc' : 'desc',
			},
		})

		entries = query.map(entry => {
			return {
				id: entry.user.id,
				name: entry.user.firstName,
				value: entry.value,
			}
		})
	}

	if (scoreboard.type === 'TIME' || scoreboard.type === 'ADTMEISTER') {
		// Move all -1 entries to end
		const dnfs: { id: number; name: string; value: number }[] = []

		entries = entries.filter(entry => {
			if (entry && entry.value === -1) {
				dnfs.push(entry)
				return false
			}
			return true
		})

		entries.push(...dnfs)
	}

	// Filter out repeat users
	const seen = new Set()
	entries = entries.filter(entry => {
		if (seen.has(entry.id)) {
			return false
		}

		seen.add(entry.id)
		return true
	})

	const notOpen = scoreboard.opensAt && scoreboard.opensAt > new Date()
	const closed = scoreboard.closesAt && scoreboard.closesAt < new Date()

	const canSubmit = !notOpen && !closed

	return { scoreboard, title: scoreboard.name, entries, canSubmit }
}) satisfies PageServerLoad
