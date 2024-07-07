import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const job = await db.job.findFirst({
		where: {
			id: Number.parseInt(params.id),
		},
	})

	if (!job) {
		return error(404, 'Job niet gevonden')
	}

	return { job, title: job.name }
}) satisfies PageServerLoad
