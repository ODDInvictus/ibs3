import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

export const load = (async () => {
  return {
    users: db.user.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        firstName: 'asc'
      }
    })
  };
}) satisfies PageServerLoad;

type FailType = {
  status: number,
  message: string
}

function f(failType: FailType) {
  return fail(failType.status, Object.assign({
    success: false
  }, failType))
}

export const actions = {
  default: async ({ locals, request }) => {
    // We get 1 or more files from the request
    // The browser prevents 0 files from being sent

    const formData = await request.formData()

    const fotos = formData.getAll('fotos') as File[]
    const creator = formData.get('creator') as string
    let name = ''

    if (creator === 'other') {
      name = formData.get('creator-other') as string

      if (name === '') {
        return f({ status: 400, message: 'Geen naam ingevuld' })
      }

    } else if (creator === locals.user.ldapId) {
      name = locals.user.firstName + ' ' + locals.user.lastName
    } else {
      // We know that creator is an user
      const u = await db.user.findFirst({
        where: {
          ldapId: creator
        }
      })
      if (!u) {
        return f({ status: 400, message: 'Geen gebruiker gevonden' })
      }

      name = u.firstName + ' ' + u.lastName
    }

    if (fotos.length === 0) {
      return f({ status: 400, message: 'Geen fotos gevonden' })
    }

    const date = Date.now()

    let c

    // Creator
    if (creator === 'other') {
      c = await db.photoCreator.upsert({
        update: {},
        create: {
          name,
        },
        where: {
          name
        }
      })
    } else {
      c = await db.photoCreator.upsert({
        update: {},
        create: {
          name,
          user: {
            connect: {
              ldapId: creator
            }
          }
        },
        where: {
          name,
          user: {
            ldapId: creator
          }
        }
      })
    }

    let ids = []

    for (const [idx, foto] of Object.entries(fotos)) {

      const ext = foto.name.split('.').pop()
      const n = name.split(' ').join('_')
      const filename = `${n}-${date}-${idx}.${ext}`

      const buf = await foto.arrayBuffer()

      // create photo object
      const p = await db.photo.create({
        data: {
          photo: filename,
          uploader: {
            connect: {
              ldapId: locals.user.ldapId
            }
          },
          creator: {
            connect: {
              id: c.id
            }
          },
          date: new Date(foto.lastModified)
        }
      })

      ids.push(p.id)

      // Now write to disk
      writeFileSync(`${process.env.UPLOAD_FOLDER}/fotos/${filename}`, Buffer.from(buf))
    }

    throw redirect(303, '/fotos/upload/success?ids=' + ids.join(','))
  }
} satisfies Actions