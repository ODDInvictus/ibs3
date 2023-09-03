import db from '$lib/server/db'
import type { PageServerLoad } from './$types';
import { getNextBirthdayInLine } from '$lib/server/birthdays';
import { LDAP_IDS } from '$lib/constants';

export const load = (async ({ locals }) => {

  // Deze methode faalt niet, ook als je 0 sessies hebt - NR
  const getTotalClicks = async () => {
    return await db.clickSession.aggregate({
      _sum: {
        amount: true
      },
      where: {
        userId: locals.user.id
      }
    });
  }

  const getTopClicker = async () => {
    let q = await db.$queryRaw`
      SELECT u.firstName, SUM(c.amount) AS amount
      FROM User AS u, ClickSession AS c
      WHERE u.id = c.userId
      GROUP BY c.userId
      ORDER BY amount DESC
      LIMIT 1` as { firstName: string, amount: number }[]

    q = q.map((e) => { return { ...e, amount: Number(e.amount) } });

    return q[0];
  }

  const getGreeting = () => {
    let word = 'Goedenavond';

    const hour = new Date().getHours();
    if (hour < 6) {
      word = 'Goedenacht';
    } else if (hour < 12) {
      word = 'Goedemorgen';
    } else if (hour < 18) {
      word = 'Goedemiddag';
    }

    return `${word}, ${locals.user.firstName}!`;
  }

  const getQuote = async () => {
    let obj

    // 1 in 2000 chance to get a quote from IBS
    if (Math.floor(Math.random() * 2000) === 1234) {
      obj = {
        quote: '"Wie dit leest trekt een bak" - IBS (1 op 2000 kans)'
      }
    } else {
      try {
        obj = await fetch(process.env.QUOTE_API_URL!, { headers: {
          'Authorization': `${process.env.QUOTE_API_TOKEN}`
        }}).then((res) => res.json())
      } catch (err) {
        obj = {
          quote: '"De quote module is stukkie wukkie" - IBS'
        }
      }
    }

    let message = obj.quote

    // Replace all "{string}" with "*{string}*"
    message = message.replace(/"([^"]*)"/g, '*“$1”*')

    return message
  }

  const getStrafbakken = () => {
    // Count the amount of strafbakken locals.user.id has
    return db.strafbak.count({
      where: {
        receiverId: locals.user.id,
        dateDeleted: null
      }
    })
  }

  const getFirstActivity = () => {
    const today = new Date()

    const member = locals.committees.filter((c) => c.ldapId === LDAP_IDS.MEMBERS)[0]

    if (member) {
      return db.activity.findFirst({
        orderBy: [{
          endTime: 'asc'
        }],
        where: {
          endTime: {
            gte: today
          },
        },
        include: {
          photo: true
        }
      })
    } else {
      return db.activity.findFirst({
        orderBy: [{
          endTime: 'asc'
        }],
        where: {
          endTime: {
            gte: today
          },
          membersOnly: false
        },
        include: {
          photo: true
        }
      })
    }
  }

  return {
    clicks: getTotalClicks(),
    topclicker: getTopClicker(),
    greeting: getGreeting(),
    quote: getQuote(),
    activity: getFirstActivity(),
    strafbakken: getStrafbakken(),
    nextBirthday: getNextBirthdayInLine()
  }
}) satisfies PageServerLoad;