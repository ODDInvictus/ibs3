import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'
import { z } from 'zod'

const schema = z.object({
	name: z.string(),
	description: z.string(),

	noNotification: z.boolean().default(false),
})

export const load = (async () => {
	const form = await superValidate(schema)

	return { form }
}) satisfies PageServerLoad
