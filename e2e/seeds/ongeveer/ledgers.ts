import { prisma } from '../../db'

export async function seedLedgers() {
	await prisma.ledger.deleteMany()

	await prisma.ledger.createMany({
		data: [
			{
				name: 'Uitgaven declaraties generiek',
				id: 3100,
				description: 'Declaratie generiek',
			},
			{
				name: 'Inkomsten verkoop generiek',
				id: 4500,
				description: 'Verkoop generiek',
			},
			{
				name: 'Inkomsten verkoop bier',
				id: 4501,
				description: 'Verkoop bier',
			},
			{
				name: 'Inkomsten verkoop eten',
				id: 4502,
				description: 'Verkoop eten',
			},
			{
				name: 'Cantus',
				id: 3201,
				description: 'Cantus',
			},
		],
	})
}
