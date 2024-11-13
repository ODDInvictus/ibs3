import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import Decimal from 'decimal.js'

export const load = (async ({ params }) => {
	const purchase = await db.journal.findUnique({
		where: { id: Number(params.id), type: { in: ['PURCHASE', 'DECLARATION'] } },
		include: {
			Rows: {
				include: {
					Ledger: {
						select: {
							name: true,
						},
					},
				},
			},
			Treasurer: {
				select: {
					firstName: true,
				},
			},
			Attachments: true,
			TransactionMatchRow: {
				include: {
					Transaction: true,
				},
			},
			DeclarationData: true,
		},
	})
	if (!purchase) return error(404, 'Aankoop niet gevonden')

	const attachments =
		purchase?.Attachments?.map(attatchment => {
			return {
				src: `/file/${attatchment.filename}`,
				filename: attatchment.filename,
			}
		}) ?? []

	const rows = purchase.Rows.map(row => ({
		...row,
		total: row.price.mul(row.amount).toNumber(),
		price: row.price.toNumber(),
	}))
	return {
		purchase: JSON.parse(JSON.stringify(purchase)) as typeof purchase,
		rows,
		total: purchase.Rows.reduce((acc, { price, amount }) => acc.add(price.mul(amount)), new Decimal(0)).toNumber(),
		attachments,
	}
}) satisfies PageServerLoad
