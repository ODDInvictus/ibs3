import db from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { getNextBirthdayInLine } from '$lib/server/birthdays'
import { LDAP_IDS } from '$lib/constants'
import type { Quote } from '$lib/server/prisma/client'

export const load = (async ({ locals }) => {
	// Deze methode faalt niet, ook als je 0 sessies hebt - NR
	const getTotalClicks = async () => {
		return await db.clickSession.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				userId: locals.user.id,
			},
		})
	}

	const getTopClicker = async () => {
		let q = (await db.$queryRaw`
      SELECT u.firstName, SUM(c.amount) AS amount
      FROM User AS u, ClickSession AS c
      WHERE u.id = c.userId
      GROUP BY c.userId
      ORDER BY amount DESC
      LIMIT 1`) as { firstName: string; amount: number }[]

		q = q.map(e => {
			return { ...e, amount: Number(e.amount) }
		})

		return q[0]
	}

	const getGreeting = () => {
		let word = 'Goedenavond'

		const hour = new Date().getHours()
		if (hour < 6) {
			word = 'Goedenacht'
		} else if (hour < 12) {
			word = 'Goedemorgen'
		} else if (hour < 18) {
			word = 'Goedemiddag'
		}

		return `${word}, ${locals.user.firstName}!`
	}

	const getQuote = async () => {
		const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

		const q: Quote[] = await db.$queryRaw`
			SELECT text FROM Quote
			ORDER BY RAND(${daySeed})
			LIMIT 1
		`
		return q[0]?.text ?? 'Geen quotes opgeslagen'
	}

	const getStrafbakken = () => {
		// Count the amount of strafbakken locals.user.id has
		return db.strafbak.count({
			where: {
				receiverId: locals.user.id,
				dateDeleted: null,
			},
		})
	}

	const getFirstActivity = () => {
		const today = new Date()

		const member = locals.committees.filter(c => c.ldapId === LDAP_IDS.MEMBERS)[0]

		if (member) {
			return db.activity.findFirst({
				orderBy: [
					{
						endTime: 'asc',
					},
				],
				where: {
					endTime: {
						gte: today,
					},
				},
			})
		} else {
			return db.activity.findFirst({
				orderBy: [
					{
						endTime: 'asc',
					},
				],
				where: {
					endTime: {
						gte: today,
					},
					membersOnly: false,
				},
			})
		}
	}

	return {
		clicks: await getTotalClicks(),
		topclicker: await getTopClicker(),
		greeting: getGreeting(),
		quote: await getQuote(),
		activity: await getFirstActivity(),
		strafbakken: await getStrafbakken(),
		nextBirthday: await getNextBirthdayInLine(),
	}
}) satisfies PageServerLoad
