import type { AccessToken, User } from '$lib/server/prisma/client'
import db from '../db'

export type TokenType = 'calendar'

export async function verifyToken(user: User, token: string, type: TokenType): Promise<boolean> {
	const accessToken = await db.accessToken.findFirst({
		where: {
			token,
		},
		include: {
			user: true,
		},
	})

	if (!accessToken) return false
	if (accessToken.user.id !== user.id) return false
	if (accessToken.type !== type) return false

	await setLastUsed(accessToken)

	return true
}

type VerifyUser = {
	valid: boolean
	user: User | null
}

export async function verifyTokenWithoutUser(token: string, type: TokenType): Promise<VerifyUser> {
	const accessToken = await db.accessToken.findFirst({
		where: {
			token,
		},
		include: {
			user: true,
		},
	})

	if (!accessToken) return { valid: false, user: null }
	if (accessToken.type !== type) return { valid: false, user: null }

	await setLastUsed(accessToken)

	return { valid: true, user: accessToken.user }
}

export async function getOrCreateToken(user: User, type: TokenType): Promise<AccessToken> {
	const accessToken = await db.accessToken.findFirst({
		where: {
			userId: user.id,
			type,
		},
	})

	if (accessToken) {
		await setLastUsed(accessToken)
		return accessToken
	}

	return db.accessToken.create({
		data: {
			user: {
				connect: {
					id: user.id,
				},
			},
			type,
			name: `${user.ldapId}-${type}`,
		},
	})
}

async function setLastUsed(accessToken: AccessToken): Promise<void> {
	await db.accessToken.update({
		where: {
			token: accessToken.token,
		},
		data: {
			lastUsed: new Date(),
		},
	})
}
