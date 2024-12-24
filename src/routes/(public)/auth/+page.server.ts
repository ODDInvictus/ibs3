import type { Actions } from './$types'
import { signIn } from '$lib/server/auth'
import { Setting, settings } from '$lib/server/settings/settings'

export const actions: Actions = {
	default: signIn,
}

export const load = async () => {
	return {
		version: settings.get(Setting.VERSION, '0.0.0'),
		gitCommit: settings.get(Setting.GIT_COMMIT, 'unknown'),
		githubLink: settings.get(Setting.GITHUB_LINK, ''),
	}
}
