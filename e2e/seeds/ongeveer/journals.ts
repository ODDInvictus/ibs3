import { type FinancialPerson, FinancialPersonType, JournalType, Product } from '@prisma/client'
import { prisma } from '../../db'

async function getInterActief(financialPersons: FinancialPerson[]) {
	const interActief = financialPersons.find(fp => fp.type === FinancialPersonType.OTHER && fp.name === 'I.C.T.S.V. Inter-Actief')
	if (!interActief) {
		throw new Error('Financial person Inter-Actief not found')
	}
	return interActief
}

export async function seedJournalOther(financialPersons: FinancialPerson[]) {
	const interActief = await getInterActief(financialPersons)
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

export async function seedJournalProduct(financialPersons: FinancialPerson[], products: Product[]) {
	const interActief = await getInterActief(financialPersons)
	const grolschPijpje = products.find(p => p.name === 'Grolsch pijpje')
	if (!grolschPijpje) {
		throw new Error("Product 'Grolsch pijpje' not found")
	}

	await prisma.journal.create({
		data: {
			type: JournalType.SALE,
			relationId: interActief.id,
			date: new Date('2003-04-14T21:00:00'),
			termsOfPayment: 30,
			ref: 'Verkoop 1 grolsch pijpje',
			Rows: {
				create: {
					ledgerId: 4501,
					amount: 1,
					price: 1.5,
					description: 'Bier',
					productId: grolschPijpje.id,
				},
			},
		},
	})
}
