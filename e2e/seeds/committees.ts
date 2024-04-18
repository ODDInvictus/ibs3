import { prisma } from '../seed'

export async function seedCommittees() {
	/* Committees */

	const committees = [
		{
			id: 1,
			ldapId: 'bakkentrekkers',
			isActive: true,
			name: 'De Bakkentrekkers',
		},
		{
			id: 3,
			ldapId: 'colosseum',
			isActive: true,
			name: 'Inwoners van het Colosseum',
		},
		{
			id: 4,
			ldapId: 'feuten',
			isActive: true,
			name: 'Feuten',
		},
		{
			id: 5,
			ldapId: 'financie',
			isActive: true,
			name: 'FinanCie',
		},
		{
			id: 6,
			ldapId: 'ibs-admins',
			isActive: true,
			name: 'IBS Admins',
		},
		{
			id: 7,
			ldapId: 'leden',
			isActive: true,
			name: 'Leden',
		},
		{
			id: 8,
			ldapId: 'senaat',
			isActive: true,
			name: 'Senaat',
		},
	]

	await prisma.committee.createMany({
		data: committees,
	})

	/* Committee members */

	// Now add some users to the committees
	const committeeMembers = [
		// User 1 is bakkentrekker, ibs-admin and lid
		{
			committeeId: 1,
			userId: 1,
		},
		{
			committeeId: 6,
			userId: 1,
		},
		{
			committeeId: 7,
			userId: 1,
		},
		// User 2 is lid en inwoner van colosseum
		{
			committeeId: 7,
			userId: 2,
		},
		{
			committeeId: 3,
			userId: 2,
		},
		// User 3 is feut
		{
			committeeId: 4,
			userId: 3,
		},
		// User 4 is lid en financie
		{
			committeeId: 7,
			userId: 4,
		},
		{
			committeeId: 5,
			userId: 4,
		},
		// User 5 is senaat en lid
		{
			committeeId: 7,
			userId: 5,
		},
		{
			committeeId: 8,
			userId: 5,
		},
		// User 6 is lid
		{
			committeeId: 7,
			userId: 6,
		},
	]

	await prisma.committeeMember.createMany({
		data: committeeMembers,
	})

	return { committees, committeeMembers }
}
