import db from '$lib/server/db'
import { pagination } from '$lib/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals, url }) => {
	const { p, size } = pagination(url)

	const financialPersonIds = await db.financialPerson.findMany({
		where: {
			FinancialPersonDataUser: {
				userId: locals.user.id,
			},
		},
		select: {
			id: true,
		},
	})

	if (financialPersonIds.length > 1) {
		error(500, 'Meerdere financiële personen gevonden voor user #' + locals.user.id)
	}

	if (financialPersonIds.length === 0) {
		error(500, 'Geen financiële persoon gevonden voor user #' + locals.user.id)
	}

	const transactions = await db.saldoTransaction.findMany({
		where: {
			OR: [
				{
					to: {
						FinancialPersonDataUser: {
							userId: locals.user.id,
						},
					},
				},
				{
					from: {
						FinancialPersonDataUser: {
							userId: locals.user.id,
						},
					},
				},
			],
		},
		include: {
			Transaction: {
				select: {
					createdAt: true,
					TransactionMatchRow: {
						select: {
							Journal: {
								select: {
									streeplijstId: true,
								},
							},
						},
					},
				},
			},
			from: {
				select: {
					id: true,
				},
			},
			to: {
				select: {
					id: true,
				},
			},
		},
		orderBy: {
			Transaction: {
				createdAt: 'desc',
			},
		},
		take: size,
		skip: p * size,
	})

	return {
		transactions: JSON.parse(JSON.stringify(transactions)) as typeof transactions,
		p,
		size,
		financialPersonId: financialPersonIds[0].id,
	}
}) satisfies PageServerLoad
