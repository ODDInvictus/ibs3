import { prisma } from '../seed'

export async function seedMaluspunten() {
	const maluspunten = [
		{
			giverId: 1,
			receiverId: 3,
			reason: 'Te laat',
		},
		// Oude
		{
			giverId: 1,
			receiverId: 2,
			reason: 'Huts',
		},
	]

	await prisma.maluspunt.createMany({
		data: maluspunten,
	})

	return { maluspunten }
}
