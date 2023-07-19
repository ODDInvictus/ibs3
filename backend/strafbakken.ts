import { User } from '@prisma/client';
import { sendNotification } from './discord-utils';
import { sendEmailNotificationFrontend } from './email-utils';
import { prisma } from './prisma';

const MONTH_NAMES = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']

function log(str: string) {
  console.log(`[STRAFBAKKEN] ${str}`)
}

export async function verdubbelStrafbakken() {
  log('Verdubbelen strafbakken')

  const strafbakken = await prisma.strafbak.findMany({
    where: {
      dateDeleted: null
    },
    include: {
      receiver: true,
    }
  })

  const count: Map<number, number> = new Map()

  for (const strafbak of strafbakken) {
    // Now count per receiver
    let num = count.get(strafbak.receiver.id) ?? 0
    num += 1
    count.set(strafbak.receiver.id, num)
  }

  const month = MONTH_NAMES[new Date().getMonth()]
  const year = new Date().getFullYear()

  count.forEach(async (bakken: number, user: number) => {
    const limit = Number(process.env.STRAFBAKKEN_DOUBLE_LIMIT) || 50
    const doubled = Math.min(bakken * 2, limit)

    const extra = doubled - bakken

    const array: { receiverId: number, reason: string, location: string }[] = []

    for (let i = 0; i < extra; i++) {
      array.push({
        receiverId: user,
        reason: `Verdubbeling strafbakken ${month}-${year} #${i + 1}`,
        location: 'De meterkast'
      })
    }

    log(`${user} krijgt ${extra} extra strafbakken`)

    await prisma.strafbak.createMany({
      data: array
    })
  })

  // Now we end with a notification

  log('Sending discord notification')
  await notifyStrafbakken()

  // Send mails
  log('Sending emails')

  count.forEach(async (bakken: number, userId: number) => {
    // First get user
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      log(`User ${userId} not found`)
      return
    }

    log(`Sending email to ${user.firstName}`)

    // Send email
    await sendEmail(user, bakken)
  })
}

export async function notifyStrafbakken() {
  // Get current count of strafbakken
  const strafbakken = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    select: {
      firstName: true,
      nickname: true,
      id: true,
      _count: {
        select: {
          StrafbakReceived: {
            where: {
              dateDeleted: null,
            },
          },
        },
      },
    },
    orderBy: [
      {
        becameMember: {
          sort: 'asc',
          nulls: 'last'
        }
      },
      {
        becameFeut: {
          sort: 'asc',
          nulls: 'last'
        }
      },
      {
        firstDrink: {
          sort: 'asc',
          nulls: 'last'
        }
      },
    ]
  })

  // Send discord webhook notification

  // Find name with most letters
  let max = 0
  for (const user of strafbakken) {
    if (user.firstName.length > max) {
      max = user.firstName.length
    }
  }

  // Add spaces to make it look nice
  for (const user of strafbakken) {
    const name = user.firstName
    const spaces = max - name.length
    user.firstName = name + ' '.repeat(spaces)
  }

  // Now add 1 or 2 spaces to StrafbakRecieved
  for (const user of strafbakken) {
    const strafbakken = user._count.StrafbakReceived
    if (strafbakken < 10) {
      // @ts-expect-error Klopt ja
      user.strafbak = `          ${strafbakken}`
    } else {
      // @ts-expect-error Klopt ja
      user.strafbak = `         ${strafbakken}`
    }
  }

  let first = true

  const name = `\`Naam ${' '.repeat(max - 4)}| Strafbakken\``

  const fields = [{
    name,
    value: strafbakken.map(user => {
      if (first) {
        first = false
        // @ts-expect-error Klopt ja
        return `\`${'-'.repeat(name.length - 2)}\`\n\`${user.firstName} | ${user.strafbak}\``
      }

      // @ts-expect-error Klopt ja
      return `\`${user.firstName} | ${user.strafbak}\``
    }).join('\n')
  }]

  await sendNotification({
    title: 'Een nieuwe maand is aangebroken!',
    description: 'Dat betekend dat de strafbakken zijn verdubbeld! Wie heeft er de meeste strafbakken?',
    color: 0xff0000,
    fields
  })
}

async function sendEmail(to: User, bakken: number) {
  const receiver = `${to.firstName} ${to.lastName} <${to.email}>`

  await sendEmailNotificationFrontend('Strafbakken verdubbeld!',
    `
Beste ${to.firstName},

De strafbakken zijn weer verdubbeld! Je hebt nu ${bakken} strafbakken.

Bekijk de tussenstand op ${process.env.IBS_URL}/strafbakken

Groetjes,
Invictus Bier Systeem
`, receiver)
}