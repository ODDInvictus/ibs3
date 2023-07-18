import db from '$lib/server/db'
import { getUser } from '$lib/server/userCache'
import { error } from '@sveltejs/kit'

import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async (event) => {
  const { request, locals } = event;

  // Probeer de user te vinden als dat niet lukt om de een of andere reden, dan is het onsuccesvol
  let userId: number | undefined = locals.user?.id;
  if (!userId) {
    const session = await locals.getSession();
    const user = await getUser(session);
    userId = user?.id;
  }
  if (!userId) throw error(400, {
    message: "User ID not found"
  });

  const { startTime, amount, endTime }: { 
    startTime: number,
    amount: number,
    endTime?: number
  } = await request.json();
  if (Number.isNaN(startTime) || Number.isNaN(amount)) throw error(400, {
    message: "No startTime or sessionClicks"
  });

  function isValidDate(d: any) {
    // @ts-ignore
    return d instanceof Date && !isNaN(d);
  }

  const startTimeDate = new Date(startTime);
  if (!isValidDate(startTimeDate)) throw error(400);

  // @ts-ignore
  let endTimeDate = new Date(endTime);
  if (!isValidDate(endTimeDate)) endTimeDate = new Date();

  try {
    await db.clickSession.create({
      data: {
        userId,
        amount,
        startTime: startTimeDate,
        endTime: endTimeDate
      }
    });
  } catch (error: any) {
    console.error(error);
    throw error(500);
  }

  return new Response(null, {
    status: 201,
  });
}