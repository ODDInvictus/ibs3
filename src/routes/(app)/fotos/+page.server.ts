import type { PageServerLoad } from './$types';
import db from '$lib/server/db'
import type { Photo } from '@prisma/client';

type PhotoHighlight = {
  name: string
  filename: string
  pid: number
}

export const load = (async () => {
  const rand = Date.now()

  const getHighlight = async () => {
    const query: Photo[] = await db.$queryRaw`
      SELECT Photo.id as pid, name, filename FROM Photo
      LEFT JOIN PhotoCreator ON PhotoCreator.id = Photo.creatorId
      ORDER BY RAND(${rand})
      LIMIT 1;
    `

    return query[0] as unknown as PhotoHighlight
  }

  return {
    highlight: getHighlight()
  };
}) satisfies PageServerLoad;