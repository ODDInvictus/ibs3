import db from '$lib/server/db'
import { getUser } from '$lib/server/userCache'
import { error } from '@sveltejs/kit'

import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request, locals }) => {
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
        userId: locals.user.id,
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