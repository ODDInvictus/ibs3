import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db'
import { fail } from '@sveltejs/kit';

export const load = (async ({ params, locals, url }) => {

  if (!params.id || isNaN(Number(params.id))) {
    return {}
  }

  const photo = await db.photo.findFirst({
    where: {
      id: Number(params.id)
    },
    include: {
      creator: true,
      peopleTagged: {
        include: {
          user: {
            select: {
              firstName: true,
              ldapId: true,
            }
          }
        }
      },
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
      comments: {
        include: {
          commenter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureId: true,
              ldapId: true,
            }
          },
        }
      },
      ratings: {
        select: {
          rating: true,
          userId: true,
        }
      }
    }
  })

  if (!photo) {
    return {}
  }

  const tags = await db.photoTag.findMany({
    where: {
      photos: {
        none: {
          photoId: photo.id
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  let avgRating = 0

  for (const rating of photo.ratings) {
    avgRating += rating.rating
  }

  avgRating /= photo.ratings.length


  let photoUrl = ''
  const quality = url.searchParams.get('quality')

  if (quality === 'origineel') {
    photoUrl = `/image/id/${photo.id}`
  } else {
    let qualityParam = 'large'
    if (quality === 'klein') {
      qualityParam = 'small'
    } else if (quality === 'normaal') {
      qualityParam = 'medium'
    } else if (quality === 'groot') {
      qualityParam = 'large'
    }
    photoUrl = `/image/${photo.filename}?size=${qualityParam}`
  }

  return {
    photo,
    photoUrl,
    avgRating,
    tags
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params, locals }) => {
    const reqData = await request.formData()
    const comment = reqData.get('comment')

    if (!comment || comment.length < 1) {
      return f(400, 'Probeer het nog een keertje, ditmaal met tekst!')
    }

    const photoId = params.id

    if (!photoId || isNaN(Number(photoId))) {
      return f(404, 'Foto niet gevonden')
    }


    const c = await db.comment.create({
      data: {
        comment: comment as string,
        commenterId: locals.user.id,
        photoId: Number(photoId)
      },
      include: {
        commenter: {
          select: {
            id: true,
            firstName: true,
            profilePictureId: true,
            lastName: true,
            ldapId: true,
          }
        }
      }
    })

    return {
      message: 'Reactie geplaatst!',
      comment: c
    }

  }
} satisfies Actions

function f(status: number, message: string) {
  return fail(status, {
    message
  })
}