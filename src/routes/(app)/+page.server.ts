import db from '$lib/server/db'
import { getUser } from '$lib/server/userCache'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';

const words = [
  'Weezer',
  'CaptainSparklez',
  'Minecraft',
  'Diederik',
  'Naut',
  'Bier',
  'Invictus',
  'Coldplay',
  'JoyRadio',
  'Kerst',
  'Abstracte Algebra',
  'KB45',
  'http://localhost:5173',
  'marktplaats.nl',
  'kaas.nl',
  'de ultieme kaasbeleving',
  'discord',
  'docker',
  'phpMyAdmin',
  'een emmer van de trap tyfen',
  'de frituurpan',
  'zijn fiets',
  'de vestingbar',
  'kunnen fietsen',
  'een koe',
  'de SmartXP',
  '130 rijden op de vluchtstrook',
  'de mac',
  'de mek'
];

export const load = (async ({ locals }) => {
  const dayInt = new Date().getDay();

  const getMemberOfTheDay = async () => {
    const query: { firstName: string, picture: string }[] = await db.$queryRaw`
      SELECT firstName, picture FROM User
      WHERE isActive = true
      ORDER BY RAND(${dayInt})
      LIMIT 1;
    `
    return query[0];
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

  const nautWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  }

  return {
    member: getMemberOfTheDay(),
    clicks: getTotalClicks(),
    topclicker: getTopClicker(),
    nautWord: nautWord(),
    greeting: getGreeting()
  }
}) satisfies PageServerLoad;