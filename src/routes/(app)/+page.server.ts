import db from '$lib/server/db'
import { getUser } from '$lib/server/userCache'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const dayInt = new Date().getDay()

  const getMemberOfTheDay = async () => {
    const query: { firstName: string, picture: string }[] = await db.$queryRaw`
      SELECT firstName, picture FROM User
      WHERE isActive = true
      ORDER BY RAND(${dayInt})
      LIMIT 1;
    `
    return query[0]
  }

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
      })
    } catch (error) {
      console.error(error);
      return fail(500)
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

      q = q.map((e) => { return { ...e, amount: Math.round(e.amount) } })

      return q[0]

    } catch (error) {
      console.error(error);
      return fail(500)
    }
  }

  return {
    member: getMemberOfTheDay(),
    clicks: getTotalClicks(),
    topclicker: getTopClicker(),
  }
}) satisfies PageServerLoad;