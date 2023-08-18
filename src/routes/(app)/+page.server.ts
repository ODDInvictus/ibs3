import db from '$lib/server/db'
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getBirthdaysInOrder, getNextBirthdayInLine } from '$lib/server/birthdays';

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

    try {
      obj = await fetch('https://nierot.com').then((res) => res.json())
    } catch (err) {
      obj = {
        message: '"De quote module is stukkie wukkie" - IBS'
      }
    }

    let message = obj.message

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
    return db.activity.findFirst({
      where: {
        startTime: {
          gte: new Date()
        }
      }
    })
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