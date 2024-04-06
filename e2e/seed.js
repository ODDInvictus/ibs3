import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const usernames = {
  1: 'admin',
  2: 'colosseum',
  3: 'feut',
  4: 'financie',
  5: 'senaat',
  6: 'lid'
}

async function main() {
  console.log("Start seeding...")
  // Create committees
  const committees = [
    {
      id: 1,
      ldapId: 'bakkentrekkers',
      isActive: true,
      name: 'De Bakkentrekkers'
    },
    {
      id: 3,
      ldapId: 'colosseum',
      isActive: true,
      name: 'Inwoners van het Colosseum'
    },
    {
      id: 4,
      ldapId: 'feuten',
      isActive: true,
      name: 'Feuten'
    },
    {
      id: 5,
      ldapId: 'financie',
      isActive: true,
      name: 'FinanCie'
    },
    {
      id: 6,
      ldapId: 'ibs-admins',
      isActive: true,
      name: 'IBS Admins'
    },
    {
      id: 7,
      ldapId: 'leden',
      isActive: true,
      name: 'Leden'
    },
    {
      id: 8,
      ldapId: 'senaat',
      isActive: true,
      name: 'Senaat'
    }
  ]

  await prisma.committee.createMany({
    data: committees
  }).catch(e => {})

  const users = []

  for (let i = 1; i <= 6; i++) {
    users.push({
      id: i,
      isActive: true,
      firstName: usernames[i],
      lastName: 'Test',
      ldapId: `user-${i}-${usernames[i]}`,
      email: `user-${i}@example.com`,
      personalEmail: `user-${i}@personal.example.com`,
      nickname: usernames[i],
      birthDate: new Date('2000-01-01'),
      phone: '0601010101',
      firstDrink: new Date('2021-01-01'),
      becameFeut: new Date('2021-01-02'),
      becameMember: new Date('2021-01-03'),
    })
  }

  await prisma.user.createMany({
    data: users
  }).catch(e => {})

  // Now add some users to the committees
  const committeeMembers = [
    // User 1 is bakkentrekker, ibs-admin and lid
    {
      committeeId: 1,
      userId: 1,
    },
    {
      committeeId: 6,
      userId: 1,
    },
    {
      committeeId: 7,
      userId: 1,
    },
    // User 2 is lid en inwoner van colosseum
    {
      committeeId: 7,
      userId: 2,
    },
    {
      committeeId: 3,
      userId: 2,
    },
    // User 3 is feut
    {
      committeeId: 4,
      userId: 3,
    },
    // User 4 is lid en financie
    {
      committeeId: 7,
      userId: 4,
    },
    {
      committeeId: 5,
      userId: 4,
    },
    // User 5 is senaat en lid
    {
      committeeId: 7,
      userId: 5,
    },
    {
      committeeId: 8,
      userId: 5,
    },
    // User 6 is lid
    {
      committeeId: 7,
      userId: 6,
    }
  ]

  await prisma.committeeMember.createMany({
    data: committeeMembers
  }).catch(e => {})

  const locations = [
    {
      id: 1,
      name: 'De Kelder',
      adress: 'Kelderstraat 1',
      country: 'Nederland',
      postalCode: '7500AA',
      city: 'Enschede',
      description: 'Huts',
    },
    {
      id: 2,
      name: 'De Bastille',
      adress: 'De Hems 10',
      country: 'Nederland',
      postalCode: '7500AA',
      city: 'Enschede',
      description: 'Huts',
    }
  ]

  await prisma.activityLocation.createMany({
    data: locations
  }).catch(e => {})

  const activities = [
    {
      id: 1,
      name: 'Borrel',
      description: 'Gezellig borrelen',
      startTime: new Date('2044-01-01T21:00:00'),
      endTime: new Date('2044-01-01T21:00:00'),
      locationId: 2,
      committeeId: 1,
    },
    {
      id: 2,
      name: 'Alleen voor leden',
      description: 'Alleen voor leden',
      startTime: new Date('2044-01-01T21:00:00'),
      endTime: new Date('2044-01-01T23:55:00'),
      locationId: 1,
      committeeId: 7,
      membersOnly: true,
    },
    {
      id: 3,
      name: 'Feutendag',
      description: 'Feutendag',
      startTime: new Date('2044-01-01T21:00:00'),
      endTime: new Date('2044-01-01T23:55:00'),
      locationId: 1,
      committeeId: 4,
    }
  ]

  await prisma.activity.createMany({
    data: activities
  }).catch(() => {})

  const attending = []
  for (const user of users) {
    for (const activity of activities) {
      attending.push({
        userId: user.id,
        activityId: activity.id,
      })
    }
  }

  await prisma.attending.createMany({
    data: attending
  }).catch(e => {})

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
    }
  ]

  await prisma.maluspunt.createMany({
    data: maluspunten
  }).catch(e => {})

  console.log("Seeding finished successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })