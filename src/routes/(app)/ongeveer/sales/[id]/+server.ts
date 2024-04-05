import { authorization } from '$lib/ongeveer/utils'
import db from '$lib/server/db'
import type { RequestHandler } from './$types'
import { getJournal } from './getJournal'

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) return new Response('Invalid id', { status: 400 })
	if (!authorization(locals.roles)) return new Response('Unauthorized', { status: 403 })

	const { journal, paid } = await getJournal(id)
	if (!journal) return new Response('Not found', { status: 404 })

	if (paid !== 0) return new Response('Cannot delete a matched journal', { status: 409 })

	try {
		await db.journal.delete({ where: { id } })
	} catch (e) {
		console.error(e)
		return new Response(null, { status: 500 })
	}

	return new Response()
}
