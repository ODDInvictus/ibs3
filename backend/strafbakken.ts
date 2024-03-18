import { sendNotification } from './discord-utils';
import { sendEmailNotificationFrontend } from './email-utils';
import { getPreference } from './preference-utils';
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


  for (const [user, bakken] of count) {
    const limit = Number(process.env.STRAFBAKKEN_DOUBLE_LIMIT) || 50
    let doubled
    if (bakken < 8) {
      doubled = bakken * 2
    } else {
      doubled = Math.max(bakken + 1, Math.min(bakken * 2 * (1/(1+(bakken/limit))) + 3, limit))
    }
    Math.round(doubled)

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
  }

  // Now we end with a notification

  log('Sending discord notification')
  await notifyStrafbakken()

  // Send mails
  log('Sending emails')

  const preferences = await getPreference('email_strafbakken_doubled')

  count.forEach(async (bakken: number, userId: number) => {
    // get preference
    const pref = preferences.find(p => p.userId === userId)

    if (!pref) {
      log(`No preference found for user ${userId}`)
      return
    }

    log(`Sending email to ${pref.user.firstName}`)

    // Send email
    await sendEmailNotificationFrontend('strafbakken-doubled', pref.user, { bakken })
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