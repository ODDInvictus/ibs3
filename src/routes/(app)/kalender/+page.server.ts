import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'
import type { Prisma } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const today = new Date()
  // If the user is in the members committee, show all events
  const isMember = locals.committees.find(c => c.ldapId === LDAP_IDS.MEMBERS) !== undefined

  let activities = []

  if (!isMember) {
    activities = await db.activity.findMany({
      orderBy: [{
        endTime: 'asc'
      }],
      where: {
        endTime: {
          gte: today
        },
        membersOnly: false
      },
      include: {
        location: {
          select: {
            name: true
          }
        },
        photo: true
      }
    })
  } else {
    activities = await db.activity.findMany({
      orderBy: [{
        endTime: 'asc'
      }],
      where: {
        endTime: {
          gte: today
        },
      },
      include: {
        location: {
          select: {
            name: true
          }
        },
        photo: true
      }
    })
  }

  return {
    activities
  }
}) satisfies PageServerLoad