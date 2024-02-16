import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function committees() {
  await prisma.committee.create({
    data: {
      id: 1,
      name: 'De Bakkentrekkers',
      ldapId: 'bakkentrekkers',
      isActive: true,
    }
  })

  await prisma.committee.create({
    data: {
      id: 2,
      name: 'Senaat',
      ldapId: 'senaat',
      isActive: true,
    }
  })

  await prisma.committee.create({
    data: {
      id: 3,
      name: 'Feuten',
      ldapId: 'feuten',
      isActive: true,
    }
  })

  await prisma.committee.create({
    data: {
      id: 4,
      name: 'Leden',
      ldapId: 'leden',
      isActive: true,
    }
  })

  await prisma.committee.create({
    data: {
      id: 5,
      name: 'IBS admins',
      ldapId: 'ibs-admins',
      isActive: false,
    }
  })
}

async function users() {
  // Admin
  // Senator
  // Bakkentrekker
  // Feut
  // Lid
  // Lid inactief
  await prisma.user.create({
    data: {
      id: 1,
      isActive: true,
      firstName: 'Admin',
      lastName: '1',
      ldapId: 'user1',
      email: 'user1@internal.example.com',
      personalEmail: 'user1@external.example.com',
      nickname: 'De eerste',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })

  // Admin
  await prisma.committeeMember.create({
    data: {
      committeeId: 1,
      userId: 1,
    }
  })

  // Bakkentrekker
  await prisma.committeeMember.create({
    data: {
      committeeId: 5,
      userId: 1,
    }
  })

  await prisma.user.create({
    data: {
      id: 2,
      isActive: true,
      firstName: 'Senaat',
      lastName: '2',
      ldapId: 'user2',
      email: 'user2@internal.example.com',
      personalEmail: 'user2@external.example.com',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })

  // Senator
  await prisma.committeeMember.create({
    data: {
      committeeId: 2,
      userId: 2,
    }
  })

  await prisma.user.create({
    data: {
      id: 3,
      isActive: true,
      firstName: 'Bakkentrekker',
      lastName: '3',
      ldapId: 'user3',
      email: 'user3@internal.example.com',
      personalEmail: 'user3@external.example.com',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })

  // Bakkentrekker
  await prisma.committeeMember.create({
    data: {
      committeeId: 1,
      userId: 3,
    }
  })

  await prisma.user.create({
    data: {
      id: 4,
      isActive: true,
      firstName: 'Feut',
      lastName: '4',
      ldapId: 'user4',
      email: 'user4@internal.example.com',
      personalEmail: 'user4@external.example.com',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })

  // Feut
  await prisma.committeeMember.create({
    data: {
      committeeId: 3,
      userId: 4,
    }
  })

  await prisma.user.create({
    data: {
      id: 5,
      isActive: true,
      firstName: 'Lid',
      lastName: '5',
      ldapId: 'user5',
      email: 'user5@internal.example.com',
      personalEmail: 'user5@external.example.com',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })

  await prisma.user.create({
    data: {
      id: 6,
      isActive: false,
      firstName: 'Inactief',
      lastName: '6',
      ldapId: 'user6',
      email: 'user6@internal.example.com',
      personalEmail: 'user6@external.example.com',
      birthDate: new Date('1990-01-01'),
      phone: '0612345678',
    }
  })



  // Make everyone a member of the Leden committee

  await prisma.committeeMember.createMany({
    data: [
      { committeeId: 4, userId: 1 },
      { committeeId: 4, userId: 2 },
      { committeeId: 4, userId: 3 },
      { committeeId: 4, userId: 4 },
      { committeeId: 4, userId: 6 },
    ]
  })
}

async function activities() {
  await prisma.activityLocation.create({
    data: {
      id: 1,
      name: 'De Bunker',
      description: 'Dankje copilot',
      country: 'Nederland',
      city: 'Amsterdam',
      adress: 'Vijzelstraat 4',
      postalCode: '1012AB',
    }
  })


  await prisma.activity.create({
    data: {
      id: 1,
      name: 'Activiteit 1',
      description: 'Een activiteit',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      committeeId: 1
    }
  })

  await prisma.activity.create({
    data: {
      id: 2,
      name: 'Activiteit: met locatie',
      description: 'Een activiteit',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      committeeId: 2,
      locationId: 1
    }
  })

  await prisma.activity.create({
    data: {
      id: 3,
      name: 'Activiteit: alleen voor leden',
      description: 'Een activiteit',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      committeeId: 2,
      membersOnly: true
    }
  })
}

async function main() {
  await committees()
  await users()

  // TODO activiteiten aanmaken via functie, niet db, anders geen attending
  await activities()




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
