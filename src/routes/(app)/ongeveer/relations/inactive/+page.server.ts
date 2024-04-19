import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		relations: await db.financialPerson.findMany({
			where: {
				type: 'OTHER',
				isActive: false,
			},
			select: {
				FinancialPersonDataOther: {
					select: {
						description: true,
					},
				},
				id: true,
				name: true,
			},
		}),
	}
}) satisfies PageServerLoad
