import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const id = Number(params.id)
	if (Number.isNaN(id)) error(400, 'Invalid ID')

	const transaction = await db.saldoTransaction.findUnique({
		where: { id },
		include: {
			to: {
				select: {
					name: true,
				},
			},
			from: {
				select: {
					name: true,
				},
			},
			Transaction: {
				select: {
					createdAt: true,
				},
			},
		},
	})

	if (!transaction) error(404, 'Transaction not found')

	return { transaction: JSON.parse(JSON.stringify(transaction)) as typeof transaction }
}) satisfies PageServerLoad
