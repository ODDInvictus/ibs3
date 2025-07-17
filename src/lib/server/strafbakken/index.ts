import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'
import { sendNotification } from '$lib/server/notifications'

/**
 * Geeft iemand een strafbak
 *
 * Deze functie houd zich aan `Setting.STRAFBAKKEN_DRINKING_BUDDIES`
 *
 * @param giverId int
 * @param receiverId int
 * @reason reden hiervoor
 * @throws NotFoundError indien giver of receiver niet bestaat
 */
export async function giveStrafbak(giverId: number, receiverId: number, reason: string) {
	let other: number = -1
	if (receiverId === 10 || receiverId === 15) {
		const buddies = settings.getBool(Setting.STRAFBAKKEN_DRINKING_BUDDIES, false)

		if (buddies) {
			other = receiverId === 10 ? 15 : 10
			reason = 'IBS ziet het verschil niet, dus geeft deze strafbak maar aan allebei: ' + reason
		}
	}

	await db.strafbak.create({
		data: {
			giverId,
			receiverId,
			reason,
		},
	})

	if (other !== -1) {
		await db.strafbak.create({
			data: {
				giverId,
				receiverId: other,
				reason,
			},
		})
	}
}

/**
 * "Verwijdert" een strafbak
 *
 * Respecteert Setting.STRAFBAKKEN_DRINKING_BUDDIES
 * Stuurt chris een email zodra iemand 0 strafbakken heeft
 */
export async function deleteStrafbak(uid: number) {
	// try to delete for the drinking buddy
	const buddies = settings.getBool(Setting.STRAFBAKKEN_DRINKING_BUDDIES, true)

	if (buddies && (uid === 10 || uid === 15)) {
		try {
			deleteStrafbak(uid === 10 ? 15 : 10)
		} catch (err) {
			// do not care
		}
	}

	const strafbak = await db.strafbak.findFirst({
		where: {
			receiverId: uid,
			dateDeleted: null,
		},
		orderBy: {
			dateCreated: 'asc',
		},
	})

	if (!strafbak) {
		throw new Error(`User ${uid} heeft geen strafbakken`)
	}

	await db.strafbak.update({
		where: {
			id: strafbak.id,
		},
		data: {
			dateDeleted: new Date(),
		},
	})

	const chrisEmail = settings.getBool(Setting.STRAFBAKKEN_CHRIS_EMAIL)

	if (chrisEmail) {
		const count = await db.strafbak.count({
			where: {
				id: uid,
				dateDeleted: null,
			},
		})

		if (count === 0) {
			await sendNotification()
		}
	}
}
