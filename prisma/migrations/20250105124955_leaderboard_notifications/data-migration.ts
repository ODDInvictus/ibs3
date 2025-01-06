import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.$transaction(async tx => {
		const leaderboardEntries = await tx.leaderboardEntry.findMany()
		const users = await tx.user.findMany({
			where: {
				isActive: true,
			},
		})

		for (const user of users) {
			const c = await tx.leaderboardChallenger.create({
				data: {
					id: 'user-' + user.id,
					firstName: user.firstName,
					lastName: user.lastName,
				},
			})

			await tx.leaderboardChallengerUser.create({
				data: {
					userId: user.id,
					challengerId: c.id,
				},
			})
		}

		for (const entry of leaderboardEntries) {
			// make new challenger
			const challenger = await tx.leaderboardChallenger.findFirst({
				where: { id: 'user-' + entry.userId },
			})

			if (!challenger) {
				throw new Error('challenger not found for leaderboard entry: ' + entry.id)
			}

			await tx.leaderboardEntry.update({
				where: { id: entry.id },
				data: {
					challengerId: challenger.id,
				},
			})
		}
	})
}

main()
	.catch(async e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect())
