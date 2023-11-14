import type { Prisma, PrismaClient, Session, User } from '@prisma/client'
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from 'next-auth/adapters'
import db from '$lib/server/db'
import { PrismaAdapter } from '@auth/prisma-adapter'

const DEBUG = true;

const log = (...args: any) => {
  if (DEBUG) console.log("[AUTH-ADAPTER]", args)
}

export default function NewIBSAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      log('createUser', user)
      // First try to find the user
      let u = await db.user.findFirst({
        where: {
          email: user.email
        }
      });

      if (u) {
        return u as unknown as AdapterUser
      }

      return await db.user.create({
        data: {
          firstName: user.name ?? 'firstNameMissing',
          lastName: user.name ?? 'lastNameMissing',
          email: user.email,
          ldapId: user.email.split('@')[0] ?? 'ldapIdMissing'
        }
      }) as unknown as AdapterUser
    },
    async getUser(id) {
      log('getUser', id)

      return await db.user.findFirst({
        where: {
          id: parseInt(id)
        }
      }) as unknown as AdapterUser
    },
    async getUserByEmail(email) {
      log('getUserByEmail', email)

      return await db.user.findFirst({
        where: {
          email
        }
      }) as unknown as AdapterUser
    },
    async getUserByAccount({ providerAccountId, provider }) {
      log('getUserByAccount', { providerAccountId, provider })

      return await db.account.findFirst({
        where: {
          providerAccountId,
          provider
        }
      }) as unknown as AdapterUser
    },
    async updateUser(user) {
      log('updateUser', user)

      return await db.user.update({
        where: {
          id: parseInt(user.id)
        },
        data: {
          ...user,
          id: parseInt(user.id)
        }
      }) as unknown as AdapterUser
    },
    async deleteUser(userId) {
      console.log(`[AUTH-ADAPTER] Attemping to delete user with id ${userId}. Halting...`)
      return null
    },
    async linkAccount(account) {
      log('linkAccount', account)

      return await db.account.create({
        data: {
          ...account,
          userId: parseInt(account.userId),
        }
      }) as unknown as AdapterAccount
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log(`[AUTH-ADAPTER] Attemping to delete account with providerAccountId ${providerAccountId} and provider ${provider}. Halting...`)
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      log('createSession', { sessionToken, userId, expires })

      return await db.session.create({
        data: {
          sessionToken,
          expires,
          userId: parseInt(userId)
        }
      }) as unknown as AdapterSession
    },
    async getSessionAndUser(sessionToken) {
      log('getSessionAndUser', sessionToken)

      const a = await db.session.findFirst({
        where: {
          sessionToken
        },
        include: {
          user: true
        }
      })

      if (!a) return null

      return {
        user: a.user as unknown as AdapterUser,
        session: a as unknown as AdapterSession
      }
    },
    async updateSession(session) {
      log('updateSession', session)

      if (!session.userId) return

      return await db.session.update({
        where: {
          sessionToken: session.sessionToken
        },
        data: {
          sessionToken: session.sessionToken,
        }
      }) as unknown as AdapterSession
    },
    async deleteSession(sessionToken) {
      console.log(`[AUTH-ADAPTER] Attemping to delete session with token ${sessionToken}. Halting...`)
      return
    },
  }
}