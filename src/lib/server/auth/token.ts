import type { AccessToken, User } from '@prisma/client'
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

	return true
}

export async function getOrCreateToken(user: User, type: TokenType): Promise<AccessToken> {
	const accessToken = await db.accessToken.findFirst({
		where: {
			userId: user.id,
			type,
		},
	})

	if (accessToken) return accessToken

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
