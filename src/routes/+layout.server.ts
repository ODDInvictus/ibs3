import type { LayoutServerLoad } from './$types'
import prisma from '$lib/server/db'
import NodeCache from 'node-cache'

// Keep user records for 24 hours
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 })

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const currentRoute = event.route

	if (!session || !session.user || !session.user.email) {
		return {
			session,
			currentRoute,
			user: null
		}
	}

	if (cache.has(session.user.email)) {
		return {
			session,
			user: cache.get(session.user.email),
			currentRoute: event.route,
		};
	}

	const user = await prisma.user.findFirst({
		where: {
			email: session?.user?.email ?? ''
		}
	})

	if (user) {
		cache.set(user.email, user);
	}

	return {
		session,
		user,
		currentRoute,
	};
};
