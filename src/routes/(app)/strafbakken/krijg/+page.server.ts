import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

const TEXTS = [
	'Nou vooruit dan maar',
	'Chris stop nou eens met jezelf strafbakken te geven',
	'Ja joh',
	'Lekker hoor',
	'Haal gelijk ff een nieuw blaadje',
	'Waar is de adtmeister?',
	'Zoek een leven',
]

export const load = (async ({ locals, url }) => {
	const chance = Math.floor(Math.random() * 100)

	if (chance < 5) {
		const bakken = []
		for (let i = 0; i < 7; i++) {
			bakken.push({
				receiverId: locals.user.id,
				reason: 'In 7!',
				location: '/strafbakken/krijg',
			})
		}

		await db.strafbak.createMany({ data: bakken })

		return { text: 'Haha, 7 strafbakken!' }
	}

	const times = Number.parseInt(url.searchParams.get('bakken') || '1')

	let reason = 'Ja joh, je mag wel een strafbak'

	if (times > 1) {
		reason = 'Ja joh, je mag er ook wel ' + times
	}

	await db.strafbak.create({
		data: {
			receiver: {
				connect: {
					id: locals.user.id,
				},
			},
			reason,
			location: '/strafbakken/krijg',
		},
	})

	const text = times === 1 ? 'Ja joh is goed' : TEXTS[Math.floor(Math.random() * TEXTS.length)]

	return { text }
}) satisfies PageServerLoad
