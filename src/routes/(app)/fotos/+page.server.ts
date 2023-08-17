import type { PageServerLoad } from './$types';
import db from '$lib/server/db'
import type { Photo } from '@prisma/client';

type PhotoOfTheDay = {
  name: string
  filename: string
}

export const load = (async () => {
  const rand = (new Date()).getDay()

  const getPhotoOfTheDay = async () => {
    const query: Photo[] = await db.$queryRaw`
      SELECT * FROM Photo
      LEFT JOIN PhotoCreator ON PhotoCreator.id = Photo.creatorId
      ORDER BY RAND(${rand})
      LIMIT 1;
    `

    return query[0] as unknown as PhotoOfTheDay
  }

  return {
    photoOfTheDay: getPhotoOfTheDay()
  };
}) satisfies PageServerLoad;