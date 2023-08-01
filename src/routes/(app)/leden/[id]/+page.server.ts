import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import fs from 'fs'
import { env } from '$env/dynamic/private'

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
    committees
  }
})

export const actions = {
  default: async ({ request, params, locals }) => {
    const id = params.id

    if (locals.user.ldapId !== id) {
      return fail(403, { success: false, message: 'Leuk geprobeerd, maar je mag dit niet doen.' })
    }

    // save the image and update the user

    const data = Object.fromEntries(await request.formData())

    db.$transaction(async tx => {

      const d = new Date()
      const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const filename = `profiel-${locals.user.ldapId}-${date}-${data.image.name}`

      const image = await data.image.arrayBuffer()

      // save the image
      fs.writeFileSync(`${env.UPLOAD_FOLDER}/users/${filename}`, Buffer.from(image), { encoding: 'binary' })

      // update the user
      await tx.user.update({
        where: {
          ldapId: locals.user.ldapId
        },
        data: {
          picture: filename
        }
      })
    })
  }
}