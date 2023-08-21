import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const POST: RequestHandler = async ({ request, params, locals }) => {
  const body = await request.json();

  const pid = Number(params.id);
  const uid = locals.user.id;

  switch (body.type) {
    case 'rating':
      return await rate(body, pid, uid);
    default:
      return err(400, 'Request type onbekend')
  }
};

function err(status: number, msg: string) {
  return new Response(JSON.stringify({
    message: msg,
    status,
    success: false
  }))
}

function success(msg: string, data: any = null) {
  return new Response(JSON.stringify({
    status: 200,
    message: msg,
    success: true,
    data,
  }))
}

type RatingBodyType = {
  type: 'rating',
  rating: number,
}

async function rate(body: RatingBodyType, pid: number, uid: number) {
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return err(400, 'Rating moet tussen 1 en 5 zijn')
  }

  const rating = body.rating;

  await db.photoRating.upsert({
    where: {
      photoId_userId: {
        photoId: pid,
        userId: uid
      },
    },
    create: {
      photoId: pid,
      userId: uid,
      rating: rating
    },
    update: {
      rating: rating
    }
  })

  // Now calculate the average rating
  const avgRating = await db.photoRating.aggregate({
    where: {
      photoId: pid
    },
    _avg: {
      rating: true
    }
  })

  return success('Rating opgeslagen', avgRating._avg.rating)
}