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
        include: {
          photoTag: true
        }
      },
      ratings: true,
      peopleTagged: {
        select: {
          user: {
            select: {
              firstName: true,
            }
          }
        }
      },
    },
  })

  const tags = db.photoTag.findMany()

  const photoCreators = db.photoCreator.findMany()

  return { photos, photoCreators, tags };
}) satisfies PageServerLoad;