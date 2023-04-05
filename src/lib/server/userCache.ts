import NodeCache from 'node-cache'
import prisma from '$lib/server/db'
import type { Session } from 'next-auth';
import type { Committee, User } from '@prisma/client';

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

export const getCommittees = async (user: User | null): Promise<Committee[] | null> => {
	if (!user) {
		return null
	}

	const token = user.ldapId + '_committees'

	if (cache.has(token)) {
		return cache.get(token) as Committee[]
	}

	try {
		const members = await prisma.committeeMember.findMany({
			where: {
				userId: user.id
			}
		})

		const committees = await prisma.committee.findMany({
			where: {
				id: {
					in: members.map(member => member.committeeId)
				}
			}
		})

		cache.set(token, committees)
		return committees
		
	} catch (e) {
		console.error(e)
		return null
	}
}