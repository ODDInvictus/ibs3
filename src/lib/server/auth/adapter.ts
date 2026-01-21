import type { Adapter, AdapterAccount } from '@auth/core/adapters'
import db from '../db'

async function createEmptyAccount(accountId: string) {
	await db.unlinkedAccount.upsert({
		where: {
			providerAccountId: accountId,
		},
		update: {},
		create: {
			providerAccountId: accountId,
		},
	})
}

export const IBSAuthAdapter: Adapter = {
	createSession: async data => {
		const userId = Number.parseInt(data.userId)

		if (isNaN(userId)) {
			throw new Error('UserID is onbekend')
		}

		const session = await db.session.create({
			data: {
				sessionToken: data.sessionToken,
				userId,
				expires: new Date(data.expires),
			},
		})

		return {
			...session,
			userId: session.userId.toString(),
		}
	},

	updateSession: async session => {
		const s = await db.session.update({
			where: { sessionToken: session.sessionToken },
			data: {
				expires: session.expires,
			},
		})

		return {
			...s,
			userId: s.userId.toString(),
		}
	},

	deleteSession: async sessionToken => {
		await db.session.delete({ where: { sessionToken } })
	},

	getSessionAndUser: async sessionToken => {
		const session = await db.session.findFirst({
			where: { sessionToken },
			include: { user: true },
		})

		if (!session) return null

		return {
			session: {
				...session,
				userId: session.userId.toString(),
			},
			user: {
				...session.user,
				// IBS does not care if an email is not verified, but @auth/core does for some reason...
				emailVerified: new Date(),
				id: session.user.id.toString(),
			},
		}
	},

	createUser: async data => {
		throw new Error('Deze gebruiker is onbekend bij IBS, kan het zijn dat deze ldapId niet in IBS bestaat, maar wel in Authentik?')
	},

	updateUser: async user => {
		throw new Error('updateUser is bewust neit geimplementeerd, omdat dit niet nodig is')
	},

	getAccount: async (providerAccountId, provider): Promise<AdapterAccount | null> => {
		console.log(providerAccountId, provider)

		const account = await db.account.findFirst({ where: { providerAccountId, provider } })

		if (!account) return null

		return {
			...account,
			// @ts-expect-error ja ik kan er toch ook niks aan doen dat dit stukkie wukkie is
			type: account.type,
			userId: account.userId.toString(),
		}
	},

	getUser: async userId => {
		const user = await db.user.findFirst({ where: { id: Number.parseInt(userId) } })

		if (!user) return null

		return {
			...user,
			id: user.id.toString(),
			emailVerified: new Date(),
		}
	},

	getUserByAccount: async providerAccountId => {
		const account = await db.account.findFirst({ where: { ...providerAccountId } })

		if (!account) {
			console.error('Account not found', providerAccountId)
			console.log('Creating empty account for', providerAccountId)
			await createEmptyAccount(providerAccountId.providerAccountId)
			return null
		}

		const user = await db.user.findFirst({ where: { id: account.userId } })

		if (!user) return null

		return {
			...user,
			id: user.id.toString(),
			emailVerified: new Date(),
		}
	},

	getUserByEmail: async email => {
		const user = await db.user.findFirst({ where: { email } })

		if (!user) return null

		return {
			...user,
			id: user.id.toString(),
			emailVerified: new Date(),
		}
	},

	linkAccount: async (account): Promise<AdapterAccount | null> => {
		const acc = await db.account.create({
			data: {
				userId: Number.parseInt(account.userId),
				type: account.type,
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				refresh_token: account.refresh_token ?? undefined,
				access_token: account.access_token ?? undefined,
				expires_at: account.expires_at ?? undefined,
				token_type: account.token_type ?? undefined,
				scope: account.scope ?? undefined,
				id_token: account.id_token ?? undefined,
				session_state: account.session_state ?? undefined,
			},
		})

		if (!acc) return null

		return {
			...acc,
			// @ts-expect-error ik ga geen enum opzetten donder maar op
			type: acc.type,
			userId: acc.userId.toString(),
		}
	},
}
