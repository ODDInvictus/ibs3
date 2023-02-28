import { LDAP_IDS } from '$lib/constants';
import { PrismaClient, type Transaction } from '@prisma/client';

const prisma = new PrismaClient()
// const prisma = new PrismaClient({ log: ['query', 'info'] });

// Prisma middleware
prisma.$use(async (params, next) => {
  // Change saldo when a transaction is created

  const changeBalance = async (transaction: Transaction) => {
    const { price, fromId, toId } = transaction

    // Decrement the balance of the sender
    await prisma.financialPerson.update({
      where: {
        id: fromId
      },
      data: {
        balance: { decrement: price }
      }
    }).catch(console.error)

    // Increment the balance of the receiver
    await prisma.financialPerson.update({
      where: {
        id: toId
      },
      data: {
        balance: {
          increment: price
        }
      }
    })
  }

  if (params.model === 'Transaction') {
    switch (params.action) {
      case 'create':
        await changeBalance(params.args.data)
        break
      case 'createMany':
        params.args.data.forEach(async (t) => await changeBalance(t))
        break
    }
  }

  return await next(params)
})

async function getCommitteeMembers(ldapId: string): Promise<User[]> {
  const cm = await prisma.committeeMember.findMany({
    where: {
      committee: {
        ldapId
      }
    },
    include: {
      member: true
    }
  })

  return cm.map(c => c.member)
}

export async function getFeuten(): Promise<User[]> {
  return await getCommitteeMembers(LDAP_IDS.FEUTEN)
}

export async function getMembers(): Promise<User[]> {
  return await getCommitteeMembers(LDAP_IDS.MEMBERS)
}

export default prisma;