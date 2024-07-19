import type { FinancialPerson, Ledger, Product } from '@prisma/client'
import { prisma } from '../../db'

function getAdminBeerAndGrolsch(financialPersons: FinancialPerson[], products: Product[], ledegers: { name: string; id: number }[]) {
	const admin = financialPersons.find(person => person.name === 'admin')
	const grolsch = products.find(product => product.name === 'Grolsch pijpje')
	const beerLedger = ledegers.find(ledger => ledger.name === 'Inkomsten verkoop bier')
	if (!admin || !grolsch || !beerLedger) {
		throw new Error(
			"Product 'grolsch pijpje' and/or financial perosn 'admin' and/or ledger 'Inkomsten verkoop bier' not found, but required to test tallysheet",
		)
	}

	return { admin, grolsch, beerLedger }
}

export async function seedUnpaidTallysheet(
	financialPersons: FinancialPerson[],
	products: Product[],
	ledegers: { name: string; id: number }[],
) {
	const { admin, grolsch, beerLedger } = getAdminBeerAndGrolsch(financialPersons, products, ledegers)
	const tallysheet = await prisma.streeplijst.create({
		data: {
			startDate: new Date('2003-04-14:12:34:00'),
			endDate: new Date('2003-04-16:12:34:00'),
			sales: {
				create: {
					relationId: admin.id,
					termsOfPayment: 30,
					type: 'SALE',
					Rows: {
						create: {
							ledgerId: beerLedger.id,
							productId: grolsch.id,
							amount: 10,
							price: 1.5,
							description: 'Grolsch pijpje',
						},
					},
				},
			},
		},
	})

	return { tallysheet }
}

export async function seedProcessedTallysheet(
	financialPersons: FinancialPerson[],
	products: Product[],
	ledegers: { name: string; id: number }[],
) {
	const { admin, grolsch, beerLedger } = getAdminBeerAndGrolsch(financialPersons, products, ledegers)
	const invictus = financialPersons.find(person => person.type === 'INVICTUS')
	if (!invictus) {
		throw new Error("Financial person 'INVICTUS' not found, but required to test tallysheet")
	}

	const tallysheet = await prisma.streeplijst.create({
		data: {
			startDate: new Date('2001-09-11:12:34:00'),
			endDate: new Date('2001-10-11:12:34:00'),
			sales: {
				create: {
					relationId: admin.id,
					termsOfPayment: 30,
					type: 'SALE',
					Rows: {
						create: {
							ledgerId: beerLedger.id,
							productId: grolsch.id,
							amount: 10,
							price: 1.5,
							description: 'Grolsch pijpje',
						},
					},
					TransactionMatchRow: {
						create: {
							amount: 15,
							Transaction: {
								create: {
									type: 'SALDO',
									SaldoTransaction: {
										create: {
											price: 15,
											description: 'Grolsch pijpje',
											fromId: admin.id,
											toId: invictus.id,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	})

	return { tallysheet }
}
