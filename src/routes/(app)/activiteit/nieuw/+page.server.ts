import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import fs from 'fs'
import { env } from '$env/dynamic/private'
import { LDAP_IDS } from '$lib/constants.js'
import type { CommitteeMember } from '@prisma/client'
import { z } from 'zod'

export const load = (async ({ locals }) => {
  const locations = db.activityLocation.findMany({
    where: {
      isActive: true
    }
  })

  return {
    locations,
    committees: locals.committees
  }
})

const validateDate = (date: string) => {
  const d = new Date(date)
  return !isNaN(d.getTime())
}

const validateTime = (time: string) => {
  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  return time.match(timeReg)
}

const formSchema = z.object({
  name: z.string({ required_error: 'Naam is verplicht', invalid_type_error: 'Naam moet een string zijn' }).min(3, { message: 'Naam moet minimaal 3 karakters lang zijn'}),
  description: z.string({ required_error: 'Beschrijving is verplicht' }).min(3, { message: 'Beschrijving moet minimaal 3 karakters lang zijn' }),
  startDate: z.string({ required_error: 'Begin datum is verplicht', invalid_type_error: 'Begin datum moet een datum zijn'}).refine(validateDate),
  startTime: z.string({ required_error: 'Begin tijd is verplicht', invalid_type_error: 'Begin tijd moet een tijdstip zijn'}).refine(validateTime, { message: 'Begin tijd is niet valide' }),
  endDate: z.string({ required_error: 'Eind datum is verplicht', invalid_type_error: 'Eind datum moet een datum zijn'}).refine(validateDate),
  endTime: z.string({ required_error: 'Eind tijd is verplicht', invalid_type_error: 'Eind tijd moet een tijdstip zijn'}).refine(validateTime, { message: 'Eind tijd is niet valide' }),
  location: z.string({ invalid_type_error: 'LocatieID is onjuist' }).refine(val => {
    const num = parseInt(val)
    return !isNaN(num)
  }).optional(),
  organisedBy: z.string({ invalid_type_error: 'CommissieID is onjuist' }).refine(val => {
    const num = parseInt(val)
    return !isNaN(num) && num > 0
  }),
  url: z.string().url({ message: 'URL is niet valide' }).or(z.literal('')),
  image: z.any(),
  membersOnly: z.boolean().optional(),
})

export const actions = {
  default: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())

    const zodData = formSchema.safeParse(data)

    if (!zodData.success) {
      // Loop through the errors array and create a custom errors array
      const errors = zodData.error.errors.map((error) => {
        return {
          field: error.path[0],
          message: error.message
        };
      });

      return fail(400, { error: true, errors });
    }
    
    const { name, description, startDate, startTime, endDate, endTime, location, organisedBy, url, image, membersOnly } = zodData.data

    const start = new Date(`${startDate} ${startTime}`)
    const end = new Date(`${endDate} ${endTime}`)

    if (start > end) {
      return fail(400, { error: true, errors: [{ field: 'endDate', message: 'Eind datum moet na de begin datum zijn' }] })
    }

    let id = 0

    try {
      await db.$transaction(async tx => {
        // first create the activity

        let loc = null

        if (location && parseInt(location) > 0) {
          loc = parseInt(location)
        }

        const activity = await tx.activity.create({
          data: {
            name,
            description,
            startTime: start,
            endTime: end,
            locationId: loc,
            membersOnly: false,
            committeeId: parseInt(organisedBy),
            url: url ?? null,
          }
        })

        id = activity.id

        if (image) {
          const filename = `activiteit-${activity.id}-${image.name}`

          // save the image
          fs.writeFileSync(`${env.UPLOAD_FOLDER}/activities/${filename}`, Buffer.from(await image.arrayBuffer()), { encoding: 'binary' })

          // update the activity with the image
          await tx.activity.update({
            where: {
              id: activity.id
            },
            data: {
              image: filename
            }
          })

        }

        // Create all attending objects

        // To do that: get all members + feuten
        // and if membersOnly is set, then exclude the feuten
        const members = await tx.committeeMember.findMany({
          where: {
            committee: {
              ldapId: LDAP_IDS.MEMBERS
            }
          }
        })

        let feuten: CommitteeMember[] = []

        if (!membersOnly) {
          feuten = await tx.committeeMember.findMany({
            where: {
              committee: {
                ldapId: LDAP_IDS.FEUTEN
              }
            }
          })
        }

        const users = members.concat(feuten)

        // Create the attending create objects
        const attending = []
        
        for (const user of users) {
          attending.push({
            userId: user.userId,
            activityId: activity.id
          })
        }

        // Create all attending objects!
        await tx.attending.createMany({
          data: attending
        })

      })
    } catch (e) {
      console.error(e)
      return fail(500, { error: true, message: 'Er ging iets mis bij het opslaan van de activiteit' })
    }

    if (id !== 0) {
      throw redirect(303, `/activiteit/${id}`)
    }
  }
}