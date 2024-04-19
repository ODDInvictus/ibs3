import { getJournals } from '$lib/ongeveer/db'
import { pagination } from '$lib/utils'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	const { p, size } = pagination(url)
	const open = url.searchParams.get('open') === '1'

	return {
		journals: await getJournals({ type: ['PURCHASE', 'DECLARATION'], pagination: { p, size }, open }),
		p,
		size,
		open,
	}
}) satisfies PageServerLoad
