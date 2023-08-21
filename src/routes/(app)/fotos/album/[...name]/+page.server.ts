import type { PageServerLoad } from './$types';
import db from '$lib/server/db'

export const load = (async ({ params }) => {
  if (!params.name) {
    return {}
  }

  const name = params.name

  if (name.startsWith('tag')) {
    // TODO: load tag
    return {
      type: 'tag',
      title: 'Tag'
    }
  }

  // We now can asssume it's an activity

  const aid = name.split('/')[1]

  if (!aid) {
    return {}
  }

  const activity = await db.activity.findFirst({
    where: {
      id: Number(aid)
    },
    include: {
      photos: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!activity) {
    return {}
  }

  return {
    type: 'activity',
    title: activity.name,
    activity
  }

}) satisfies PageServerLoad;