import { prisma } from '../../db'

export async function seedFinancialPersons(users: { id: number; firstName: string }[]) {
	const financialPersonsPromises = [
		...users.map(u => {
			return prisma.financialPerson.create({
				data: {
					name: u.firstName,
					type: 'USER',
					FinancialPersonDataUser: {
						create: {
							userId: u.id,
						},
					},
				},
			})
		}),
		prisma.financialPerson.create({
			data: {
				name: 'I.C.T.S.V. Inter-Actief',
				type: 'OTHER',
				FinancialPersonDataOther: {
					create: {
						email: 'penningmeester@inter-actief.net',
						city: 'Enschede',
					},
				},
			},
		}),
	]

	const financialPersons = await Promise.all(financialPersonsPromises)

	return { financialPersons }
}
