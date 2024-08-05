import { Setting, settings } from '$lib/server/settings/settings'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		version: settings.get(Setting.VERSION, '0.0.0'),
		gitCommit: settings.get(Setting.GIT_COMMIT, 'unknown'),
		githubLink: settings.get(Setting.GITHUB_LINK, ''),
	}
}) satisfies PageServerLoad
