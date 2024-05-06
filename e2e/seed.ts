import { seedUsers } from './seeds/users'
import { seedCommittees } from './seeds/committees'
import { seedActivities } from './seeds/activities'
import { seedMaluspunten } from './seeds/maluspunten'
import { seedLedgers } from './seeds/ongeveer/ledgers'
import { seedFinancialPersons } from './seeds/ongeveer/financialPersons'
import { prisma } from './db'
import { seedJournalOther } from './seeds/ongeveer/journals'

async function main() {
	console.log('Start seeding...')

	const { users } = await seedUsers()
	await seedCommittees()
	await seedActivities(users)
	await seedMaluspunten()
	await seedLedgers()
	const { financialPersons } = await seedFinancialPersons(users)
	await seedJournalOther(financialPersons)

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
