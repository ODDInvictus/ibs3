import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seeds/users'
import { seedCommittees } from './seeds/committees'
import { seedActivities } from './seeds/activities'
import { seedMaluspunten } from './seeds/maluspunten'

export const prisma = new PrismaClient()

async function main() {
	console.log('Start seeding...')

	const { users } = await seedUsers()
	await seedCommittees()
	await seedActivities(users)
	await seedMaluspunten()

	console.log('Seeding finished successfully!')
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
