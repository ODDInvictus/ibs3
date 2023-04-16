import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'
import type { Prisma } from '@prisma/client'

export const load = (async ({ locals }) => {
  const today = new Date()
  // If the user is in the members committee, show all events
  const isMember = locals.committees.find(c => c.ldapId === LDAP_IDS.MEMBERS) !== undefined

  let activities = []

  const query: Prisma.ActivityFindManyArgs = {
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
      }
    }
  }

  if (!isMember) {
    // @ts-expect-error Add membersOnly to query
    query.where['membersOnly'] = false
    activities = await db.activity.findMany(query)
  } else {
    activities = await db.activity.findMany(query)
  }

  return {
    activities
  }
})