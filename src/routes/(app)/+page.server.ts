import db from '$lib/server/db'
import { getUser } from '$lib/server/userCache'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load = (async ({ locals }) => {

  const getTotalClicks = async () => {
    // Probeer de user te vinden als dat niet lukt om de een of andere reden, dan is het onsuccesvol
    let userId: number | undefined = locals.user?.id;
    if (!userId) {
      const session = await locals.getSession();
      const user = await getUser(session);
      userId = user?.id;
    }
    if (!userId) return fail(400);

    try {
      return await db.clickSession.aggregate({
        _sum: {
          amount: true
        },
        where: {
          userId
        }
      });
    } catch (error) {
      console.error(error);
      return fail(500);
    }
  }

  const getTopClicker = async () => {
    try {
      let q = await db.$queryRaw`
        SELECT u.firstName, SUM(c.amount) AS amount
        FROM User AS u, ClickSession AS c
        WHERE u.id = c.userId
        GROUP BY c.userId
        ORDER BY amount DESC
        LIMIT 1` as { firstName: string, amount: number }[]

      q = q.map((e) => { return { ...e, amount: Number(e.amount) } });

      return q[0];

    } catch (error) {
      console.error(error);
      return fail(500);
    }
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
    const obj = await fetch(env.QUOTE_API_URL).then((res) => res.json())

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
  }
}) satisfies PageServerLoad;