import db from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id)
	if (isNaN(id)) error(400, 'Ongeldige ID')

	// Update the journal date to the current date
	const journal = await db.journal.update({
		where: { id, date: null },
		data: { date: new Date() },
	})

	if (!journal) error(404, `Grootboek #${id} niet gevonden`)

	redirect(301, `/ongeveer/sales/${id}`)
}
