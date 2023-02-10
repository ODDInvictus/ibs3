import type { PrismaClient, User } from '@prisma/client'
import type { Adapter, AdapterUser } from 'next-auth/adapters'

export default function IBSAdapter(client: PrismaClient) {
  return {
    async createUser(data: Omit<AdapterUser, "id">): Promise<User> {
      const { email, name, image } = data

      console.log('CreateUser', data)

      const user = await client.user.findFirst({ where: { email } })
      if (user) {
        return user
      }

      const ldapId = email.split('@')[0]

      const newUser = await client.user.create({
        data: {
          email,
          firstName: name ?? 'NIELSDOEFIX',
          lastName: "NIELSDOEFIX",
          picture: image,
          ldapId,
        },
      })

      return newUser
    },
    async getUser(id: string): Promise<User | null> {
      return client.user.findUnique({ where: { id: parseInt(id) } })
    },
    async getUserByEmail(email: string) {
      return client.user.findUnique({ where: { email } })
    },
    async updateUser(user) {
      return client.user.update({
        where: { id: user.id },
        data: user,
      })
    },
    async linkAccount(data: any) {
      console.log('linkAccount', data)
      const account = await client.account.create({ data }) 
      return account
    },
    unlinkAccount: (provider_providerAccountId) => client.account.delete({ where: { provider_providerAccountId } }) as any,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await client.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session}
    },
    createSession: (data) => client.session.create({ data }),
    updateSession: (data) => client.session.update({ data, where: { sessionToken: data.sessionToken } }),
    deleteSession: (sessionToken) => client.session.delete({ where: { sessionToken } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await client.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return account?.user ?? null
    },
  }
}