import { LDAP_IDS } from '$lib/constants'
import { applyTransaction } from '$lib/ongeveer/db'
import { PrismaClient, type User } from '$lib/server/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
// import { env } from '$env/dynamic/private'

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE } = process.env

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_DATABASE) {
	console.error('Missing one of these requierd variables: DATABASE_ + [HOST, PORT, USER, PASSWORD, DATABASE]')
	process.exit(1)
}

const adapter = new PrismaMariaDb(
	{
		host: DATABASE_HOST,
		port: Number.parseInt(DATABASE_PORT!),
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: DATABASE_DATABASE,
		connectionLimit: 5,
	},
	{ database: DATABASE_DATABASE! },
)

const prisma = new PrismaClient({ adapter }).$extends({
	query: {
		saldoTransaction: {
			async create({ args, query }) {
				let { price, fromId, toId } = args.data
				if (fromId === undefined) {
					fromId = args.data.from?.connect?.id
				}
				if (toId === undefined) {
					toId = args.data.to?.connect?.id
				}
				if (fromId === undefined || toId === undefined) {
					throw new Error('fromId or toId is undefined')
				}
				await applyTransaction({ price: Number(price), fromId, toId })
				return query(args)
			},
			async createMany({ args, query }) {
				const transactions = args.data
				if (Array.isArray(transactions)) {
					for (const transaction of transactions) {
						const { price, fromId, toId } = transaction
						if (fromId === undefined || toId === undefined) {
							throw new Error('fromId or toId is undefined')
						}
						await applyTransaction({ price: Number(price), fromId, toId })
					}
				} else {
					await applyTransaction({
						price: Number(transactions.price),
						fromId: transactions.fromId,
						toId: transactions.toId,
					})
				}
				return query(args)
			},
		},
	},
})

async function getCommitteeMembers(ldapId: string): Promise<User[]> {
	const cm = await prisma.committeeMember.findMany({
		where: {
			committee: {
				ldapId,
			},
		},
		include: {
			member: true,
		},
	})

	return cm.map(c => c.member)
}

export async function getFeuten(): Promise<User[]> {
	return await getCommitteeMembers(LDAP_IDS.FEUTEN)
}

export async function getMembers(): Promise<User[]> {
	return await getCommitteeMembers(LDAP_IDS.MEMBERS)
}

export default prisma
export const db = prisma
