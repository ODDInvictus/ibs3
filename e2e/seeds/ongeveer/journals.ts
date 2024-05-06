import { FinancialPersonType } from '@prisma/client'
import { prisma } from '../../db'

export async function seedJournalOther(financialPersons: { id: number; type: FinancialPersonType; name: string }[]) {
	const interActief = financialPersons.find(fp => fp.type === FinancialPersonType.OTHER && fp.name === 'I.C.T.S.V. Inter-Actief')
	if (!interActief) {
		throw new Error('Financial person Inter-Actief not found')
	}
	await prisma.journal.create({
		data: {
			type: 'PURCHASE',
			relationId: interActief.id,
			date: new Date('2003-04-14T21:00:00'),
			termsOfPayment: 30,
			ref: 'Huur bierbanken',
			Rows: {
				create: {
					ledgerId: 3201,
					amount: 2,
					price: 5,
					description: 'Huur bierbanken',
				},
			},
		},
	})
}
