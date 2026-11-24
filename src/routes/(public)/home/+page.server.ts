import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings/settings'
import type { PageServerLoad } from './$types'

// Snelste tijd van een tijd-ranglijst die elk uur wisselt (alleen ranglijstnaam, tijd en voornaam)
async function getSnelsteTijd() {
	const ranglijsten = await db.leaderboard.findMany({
		where: {
			type: { in: ['TIME', 'ADTMEISTER'] },
			// -1 is DNF, die tellen niet mee
			LeaderboardEntries: { some: { value: { gte: 0 } } },
		},
		select: { id: true, name: true, type: true },
		orderBy: { id: 'asc' },
	})

	if (ranglijsten.length === 0) return null

	// Elk uur een andere ranglijst: het uurnummer gehasht, zodat het willekeurig oogt maar het hele uur gelijk blijft
	const uur = Math.floor(Date.now() / (60 * 60 * 1000))
	const index = (Math.imul(uur, 2654435761) >>> 0) % ranglijsten.length
	const ranglijst = ranglijsten[index]

	const snelste = await db.leaderboardEntry.findFirst({
		where: { leaderboardId: ranglijst.id, value: { gte: 0 } },
		orderBy: { value: 'asc' },
		select: { value: true, user: { select: { firstName: true } } },
	})

	if (!snelste) return null

	return {
		ranglijst: ranglijst.name,
		type: ranglijst.type,
		waarde: snelste.value,
		naam: snelste.user.firstName,
	}
}

export const load = (async () => {
	return {
		snelsteTijd: await getSnelsteTijd(),
		// Alleen het totaal, geen namen of redenen
		openstaandeStrafbakken: await db.strafbak.count({ where: { dateDeleted: null } }),
		version: settings.get(Setting.VERSION, '0.0.0'),
		gitCommit: settings.get(Setting.GIT_COMMIT, 'unknown'),
		githubLink: settings.get(Setting.GITHUB_LINK, ''),
	}
}) satisfies PageServerLoad
