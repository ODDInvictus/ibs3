import { discordLogger } from '$lib/server/jobs/discord'
import type { PageServerLoad } from './$types'

export const load = (async () => {

  await discordLogger.enqueue('Huts', { delay: 1000, })

}) satisfies PageServerLoad
