import { error } from '@sveltejs/kit'
import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals, params }) => {
	const id = Number(params.id)
	if (!Number.isInteger(id) || id <= 0) error(404, 'Agenda-item niet gevonden')

	const event = await db.calendarEvent.findFirst({
		where: {
			id,
			OR: [{ createdById: locals.user.id }, { calendarEventUsers: { some: { userId: locals.user.id } } }],
		},
		include: {
			calendarEventUsers: {
				include: {
					user: {
						select: { id: true, firstName: true, lastName: true, nickname: true },
					},
				},
				orderBy: { user: { firstName: 'asc' } },
			},
		},
	})

	if (!event) error(404, 'Agenda-item niet gevonden')

	return { event }
}) satisfies PageServerLoad
