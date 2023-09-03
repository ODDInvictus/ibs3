import { env } from '$env/dynamic/private'
import db from '$lib/server/db'
import { randomSortDay } from '$lib/utils.js'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ params }) => {
  const activity = await db.activity.findFirstOrThrow({
    where: {
      id: parseInt(params.id)
    },
    include: {
      attending: {
        include: {
          user: true
        }
      },
      organisedBy: true,
      location: true,
      photo: true,
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
    }
  })

  const attending = randomSortDay(activity.attending)

  return {
    activity,
    attending,
    title: activity.name,
    domain: env.IBS_URL
  }
}) satisfies PageServerLoad


export const actions = {
  default: async ({ request, params, locals }) => {
    const reqData = await request.formData()
    const comment = reqData.get('comment')

    if (!comment || comment.length < 1) {
      return f(400, 'Probeer het nog een keertje, ditmaal met tekst!')
    }

    const aid = params.id

    if (!aid || isNaN(Number(aid))) {
      return f(404, 'Activiteit niet gevonden')
    }


    const c = await db.comment.create({
      data: {
        comment: comment as string,
        commenterId: locals.user.id,
        activityId: Number(aid)
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