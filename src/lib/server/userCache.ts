import NodeCache from 'node-cache'
import prisma from '$lib/server/db'
import type { Session } from 'next-auth';
import type { User } from '@prisma/client';

// Keep user records for 24 hours
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 })

export const getUser = async (session: Session | null): Promise<User | null> => {

	if (!session || !session.user || !session.user.email) {
		return null
	}

	if (cache.has(session.user.email)) {
		return cache.get(session.user.email) as User
	}

	const user = await prisma.user.findFirst({
		where: {
			email: session.user.email
		}
	})

	if (user) {
		cache.set(user.email, user);
	}

	return user
};
