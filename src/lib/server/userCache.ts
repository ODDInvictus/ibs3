import NodeCache from 'node-cache'
import prisma from '$lib/server/db'
import type { Session } from 'next-auth'
import type { Committee, User } from '@prisma/client'
import { UserRolesEmpty, Roles, type UserRoles } from '$lib/constants'

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

export const invalidateUser = (email: string) => {
	cache.del(email)
}

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

	if (cache.has(token)) {
		return cache.get(token) as UserRoles
	}

	const roles = committees.map(committee => committee.ldapId)

	let userRoles = UserRolesEmpty

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
