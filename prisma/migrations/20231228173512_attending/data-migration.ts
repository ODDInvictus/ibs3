import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction(async (tx) => {
    const attendings = await tx.attending.findMany()
    for (const attending of attendings) {
      await tx.attending.update({
        where: { id: attending.id },
        data: {
          status: attending.isAttending ? 'ATTENDING' : 'NOT_ATTENDING'
        }
      })
    }
  })
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
