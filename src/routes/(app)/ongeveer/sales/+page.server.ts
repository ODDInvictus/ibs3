import { getJournals } from '$lib/ongeveer/db'
import { pagination } from '$lib/utils'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	const { p, size } = pagination(url)

	return {
		invoices: getJournals({ type: 'SALE', pagination: { p, size } }),
		p,
		size,
	}
}) satisfies PageServerLoad
