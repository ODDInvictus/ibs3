import type { Actions } from './$types'
import { signIn } from '$lib/server/auth'

export const actions: Actions = {
	default: signIn,
}
