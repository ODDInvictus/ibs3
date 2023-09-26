import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { shouldShowEgg } from '$lib/server/egghunt';

export const load = (async ({ locals }) => {
	return {
		preferences: db.preference.findMany({
			where: {
				userId: locals.user.id
			},
			include: {
				base: true
			}
		}),
		currentTheme: locals.user.preferredTheme,
		egg: shouldShowEgg('Zask8Z6FdyZwxFQkwwUrPAUd53he7ydiLW1lJezA1mg0m7zm7O', locals.user.id)
	};
}) satisfies PageServerLoad;
