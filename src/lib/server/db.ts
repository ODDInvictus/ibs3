import { building } from '$app/environment'
import { LDAP_IDS } from '$lib/constants'
import { applyTransaction } from '$lib/ongeveer/db'
import { PrismaClient, type User } from '@prisma/client'

const prisma = new PrismaClient().$extends({
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

if (!building) {
	// voorkom prisma connection in build
	prisma.$connect()
}

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
