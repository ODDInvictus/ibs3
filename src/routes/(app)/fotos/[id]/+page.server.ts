import type { PageServerLoad } from './$types';
import db from '$lib/server/db'

export const load = (async ({ params, url }) => {

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
              name: true
            }
          }
        }
      },
      comments: {
        include: {
          commenter: true,
        }
      }
    }
  })

  if (!photo) {
    return {}
  }

  let photoUrl = ''
  const quality = url.searchParams.get('quality')

  if (!quality || quality === 'origineel') {
    photoUrl = `/upload/fotos/${photo.filename}.${photo.extension}`
  } else {
    let qualityParam = 'large'
    if (quality === 'klein') {
      qualityParam = 'small'
    } else if (quality === 'normaal') {
      qualityParam = 'medium'
    } else if (quality === 'groot') {
      qualityParam = 'large'
    }
    photoUrl = `/image/${photo.filename}-${qualityParam}.avif?photo=true`
  }

  return {
    photo,
    photoUrl,
  };
}) satisfies PageServerLoad;