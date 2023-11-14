import { LDAP_IDS } from '$lib/constants';
import { PrismaClient, type Transaction, type FinancialPerson, type User } from '@prisma/client';

const prisma = new PrismaClient();

type IncOrDec = 'increment' | 'decrement';

// Prisma middleware
prisma.$use(async (params, next) => {
	// Change saldo when a transaction is created

	// Helper function to change the balance of a financialPerson of type COMMITTEE
	const changeBalanceCommittee = async (
		tx: PrismaClient,
		fp: FinancialPerson,
		transaction: Transaction,
		type: IncOrDec
	) => {
		const { price } = transaction;

		// Get the members of the committee
		const fpdc = await tx.financialPersonDataCommittee.findFirst({
			where: {
				personId: fp.id
			}
		});

		if (!fpdc) throw new Error('FinancialPersonDataCommittee not found');

		const committeeMembers = await tx.committeeMember.findMany({
			where: {
				committeeId: fpdc.committeeId
			}
		});

		const persons = await tx.financialPersonDataUser.findMany({
			where: {
				userId: {
					in: committeeMembers.map((cm) => cm.userId)
				}
			}
		});

		// Calculate the price per member
		const pricePerMember = price / persons.length;

		// Update the balance of the members
		await tx.financialPerson.updateMany({
			where: {
				id: {
					in: persons.map((m) => m.personId)
				}
			},
			data: {
				balance: {
					[type]: pricePerMember
				}
			}
		});
	};

	const changeBalance = async (transaction: Transaction) => {
		const { price, fromId, toId } = transaction;

		await prisma.$transaction(async (tx) => {
			// Decrement the balance of the sender

			// First check the type of financialPerson. If its of type USER or INVICTUS
			// then we can just decrement the balance. If its of type COMMITTEE or ACTIVITY then we
			// need to split the price between the members of the committee.

			// Get the financialPerson
			const fp = await tx.financialPerson.findUnique({
				where: {
					id: fromId
				}
			});

			if (!fp) throw new Error('FinancialPerson not found');

			if (fp.type === 'COMMITTEE') {
				await changeBalanceCommittee(tx, fp, transaction, 'decrement');
			} else {
				await tx.financialPerson.update({
					where: {
						id: fromId
					},
					data: {
						balance: { decrement: price }
					}
				});
			}

			// Increment the balance of the receiver
			await tx.financialPerson.update({
				where: {
					id: toId
				},
				data: {
					balance: {
						increment: price
					}
				}
			});
		});
	};

	if (params.model === 'Transaction') {
		try {
			switch (params.action) {
				case 'create':
					await changeBalance(params.args.data);
					break;
				case 'createMany':
					params.args.data.forEach(async (t) => await changeBalance(t));
					break;
			}
		} catch (e) {
			return null;
		}
		// If the action did not fail, then proceed
	}
	return await next(params);
});

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
	});

	return cm.map((c) => c.member);
}

export async function getFeuten(): Promise<User[]> {
	return await getCommitteeMembers(LDAP_IDS.FEUTEN);
}

export async function getMembers(): Promise<User[]> {
	return await getCommitteeMembers(LDAP_IDS.MEMBERS);
}

export default prisma;
