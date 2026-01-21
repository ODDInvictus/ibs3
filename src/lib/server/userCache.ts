import NodeCache from 'node-cache'
import prisma from '$lib/server/db'
import type { Session } from 'next-auth'
import type { Committee, User } from '$lib/server/prisma/client'
import { UserRolesEmpty, Roles, type UserRoles } from '$lib/constants'
import { env } from '$env/dynamic/private'

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
			email: session.user.email,
		},
	})

	if (user) {
		cache.set(user.email, user)
	}

	return user
}

export const getUserTest = async (userId: number): Promise<User> => {
	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	if (user) {
		cache.set(user.email, user)
	} else {
		throw new Error('User not found')
	}

	return user
}

export const invalidateUser = (email: string) => {
	cache.del(email)
}

export const getCommittees = async (user: User | null): Promise<Committee[] | null> => {
	if (!user) {
		return null
	}

	const token = user.ldapId + '_committees'

	if (env.ENVIRONMENT !== 'test' && cache.has(token)) {
		return cache.get(token) as Committee[]
	}

	try {
		const members = await prisma.committeeMember.findMany({
			where: {
				userId: user.id,
			},
		})

		const committees = await prisma.committee.findMany({
			where: {
				id: {
					in: members.map(member => member.committeeId),
				},
			},
		})

		cache.set(token, committees)
		return committees
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getRoles = async (user: User | null, committees: Committee[] | null): Promise<UserRoles> => {
	if (!user || !committees) {
		return UserRolesEmpty
	}

	const token = user.ldapId + '_roles'

	if (env.ENVIRONMENT !== 'test' && cache.has(token)) {
		return cache.get(token) as UserRoles
	}

	const roles = committees.map(committee => committee.ldapId)

	// Create a deep copy of UserRolesEmpty
	let userRoles = JSON.parse(JSON.stringify(UserRolesEmpty)) as typeof UserRolesEmpty

	const allRoles: string[] = Object.values(Roles)

	for (const role of roles) {
		if (allRoles.indexOf(role) !== -1) {
			// @ts-expect-error
			userRoles[role] = true
		}
	}

	cache.set(token, userRoles)

	return userRoles
}
