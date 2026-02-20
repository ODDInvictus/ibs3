import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'

/**
 * Geeft iemand een strafbak
 *
 * Deze functie houd zich aan `Setting.STRAFBAKKEN_DRINKING_BUDDIES`
 *
 * @param giverId int
 * @param receiverId int
 * @reason reden hiervoor
 * @throws PrismaClientKnownRequestError indien giver of receiver niet bestaat
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
 */
export async function deleteStrafbak(uid: number, recurse?: boolean) {
	// try to delete for the drinking buddy
	const buddies = settings.getBool(Setting.STRAFBAKKEN_DRINKING_BUDDIES, true)

	if (!recurse && buddies && (uid === 10 || uid === 15)) {
		deleteStrafbak(uid === 10 ? 15 : 10, true)
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
		return
	}

	await db.strafbak.update({
		where: {
			id: strafbak.id,
		},
		data: {
			dateDeleted: new Date(),
		},
	})
}
