import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types.js'
import { getPhotoCreator, uploadPhoto } from '$lib/server/images.js'
import { createRedisJob } from '$lib/server/cache.js'
import { invalidateUser } from '$lib/server/userCache.js'

export const load = (async ({ params, locals }) => {
  let id = params.id

  if (id === 'ik') {
    id = locals.user.ldapId
  }

  const member = await db.user.findFirstOrThrow({
    where: {
      ldapId: id
    }
  })


  const committees = await db.committee.findMany({
    where: {
      CommitteeMember: {
        some: {
          member: {
            ldapId: id
          }
        }
      }
    },
    select: {
      ldapId: true,
      name: true,
    }
  })

  const isCurrentUser = locals.user.ldapId === member.ldapId

  return {
    member,
    isCurrentUser,
    committees,
    title: member.firstName + ' ' + member.lastName,
  }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, params, locals }) => {
    const id = params.id

    if (locals.user.ldapId !== id) {
      return fail(403, { success: false, message: 'Leuk geprobeerd, maar je mag dit niet doen.' })
    }

    // save the image and update the user

    const data = Object.fromEntries(await request.formData())

    const abuf = await data.image.arrayBuffer()

    if (abuf.byteLength === 0) {
      return fail(400, { success: false, message: 'Geen foto geupload' })
    }

    db.$transaction(async tx => {

      const img = data.image as any

      const p = await uploadPhoto({
        upload: {
          filename: img.name,
          buf: Buffer.from(abuf)
        },
        additionalName: 'profiel',
        runProcessingJob: false,
        uploader: locals.user,
        creator: await getPhotoCreator(locals.user, false),
        invisible: true
      }, tx)

      // update the user
      await tx.user.update({
        where: {
          ldapId: locals.user.ldapId
        },
        data: {
          profilePictureId: p.id
        }
      })
    }).then(async () => await createRedisJob('photo-processing'))
      .then(() => invalidateUser(locals.user.email))
  }
} satisfies Actions