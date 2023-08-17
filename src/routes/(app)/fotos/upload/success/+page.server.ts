import type { PageServerLoad } from './$types';
import db from '$lib/server/db'

export const load = (async ({ url, locals }) => {
  // Get ids from the query and get the photo objects
  // from the database

  const idsParam = url.searchParams.get('ids') as string

  const ids = idsParam.split(',').map(id => parseInt(id))

  const photos = db.photo.findMany({
    where: {
      id: {
        in: ids
      }
    },
    include: {
      creator: true,
      tags: {
        select: {
          photoTag: {
            select: {
              name: true,
              id: true
            }
          }
        }
      },
      ratings: true,
      peopleTagged: {
        select: {
          user: {
            select: {
              firstName: true,
              ldapId: true,
            }
          }
        },
      },
      activity: {
        select: {
          name: true,
          id: true,
          endTime: true,
        }
      }
    },
  })

  const tags = db.photoTag.findMany()

  const photoCreators = db.photoCreator.findMany()

  const people = db.user.findMany({
    where: {
      isActive: true,
    },
    select: {
      ldapId: true,
      firstName: true,
    },
    orderBy: {
      firstName: 'asc',
    }
  })

  const activities = db.activity.findMany({
    select: {
      id: true,
      name: true,
      endTime: true,
    },
    orderBy: {
      endTime: 'desc',
    }
  })

  return { photos, photoCreators, tags, people, activities };
}) satisfies PageServerLoad;