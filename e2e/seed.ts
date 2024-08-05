import { seedUsers } from './seeds/users'
import { seedCommittees } from './seeds/committees'
import { seedActivities } from './seeds/activities'
import { seedMaluspunten } from './seeds/maluspunten'
import { seedLedgers } from './seeds/ongeveer/ledgers'
import { seedFinancialPersons } from './seeds/ongeveer/financialPersons'
import { prisma } from './db'
import { seedJournalOther, seedJournalProduct } from './seeds/ongeveer/journals'
import { seedProductCategories, seedProducts } from './seeds/ongeveer/products'

async function main() {
	console.log('Start seeding...')

	const { users } = await seedUsers()
	await seedCommittees()
	await seedActivities(users)
	await seedMaluspunten()

	// Ongeveer
	await seedLedgers()
	const { financialPersons } = await seedFinancialPersons(users)
	await seedJournalOther(financialPersons)
	const { productCategories } = await seedProductCategories()
	const { products } = await seedProducts(productCategories)
	await seedJournalProduct(financialPersons, products)

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
