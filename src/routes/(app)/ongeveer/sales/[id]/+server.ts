import { createTransaction, getInvictusId } from '$lib/ongeveer/db'
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

export const POST: RequestHandler = async ({ locals, params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) return new Response('Invalid id', { status: 400 })
	if (!authorization(locals.roles)) return new Response('Unauthorized', { status: 403 })

	const { journal, toPay } = await getJournal(id)
	if (!journal) return new Response('Not found', { status: 404 })

	if (toPay === 0) return new Response('Journal already matched', { status: 409 })

	const transaction = await createTransaction({
		giver: journal.relationId,
		receiver: await getInvictusId(),
		amount: toPay,
		description: journal.description ?? '',
		isManual: false,
	})

	await db.transactionMatchRow.create({
		data: {
			journalId: id,
			transactionId: transaction.Transaction.id,
			amount: toPay,
			description: journal.description ?? '',
		},
	})

	return new Response(null, { status: 200 })
}
