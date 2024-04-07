import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import Decimal from 'decimal.js'

export const load = async ({ params, locals }) => {
	const id = Number.parseInt(params.id)
	if (Number.isNaN(id)) throw error(400, 'Ongeldige declaratie ID')

	const declaration = await db.declarationData.findUnique({
		where: { id },
		include: {
			Journal: {
				include: {
					Rows: true,
					Attachments: true,
				},
			},
		},
	})

	if (!declaration) throw error(404, `Declaratie ${params.id} niet gevonden`)

	const data = {
		id: declaration.id,
		date: declaration.createdAt,
		methodOfPayment: declaration.methodOfPayment,
		description: declaration.reason,
		status: declaration.status,
		message: declaration.reason,
		total:
			declaration.Journal?.Rows.reduce((acc, { price, amount }) => acc.add(new Decimal(price).mul(amount)), new Decimal(0)).toNumber() ??
			declaration.askedAmount.toNumber(),
		Attachments:
			declaration.Journal?.Attachments.map(({ id, filename, MIMEtype }) => ({
				id,
				filename,
				MIMEtype,
			})) ?? [],
	}

	return { declaration: data }
}
