import { LDAP_IDS } from '$lib/constants.js'
import db from '$lib/server/db'

export const load = (async ({ locals }) => {
  const today = new Date()
  // If the user is in the members committee, show all events
  const isMember = locals.committees.find(c => c.ldapId === LDAP_IDS.MEMBERS) !== undefined

  let activities = []

  if (!isMember) {
    activities = await db.activity.findMany({
      where: {
        endTime: {
          gte: today
        },
        membersOnly: false
      }
    })
  } else {
    activities = await db.activity.findMany({
      where: {
        endTime: {
          gte: today
        },
      }
    })
  }



  return {
    activities
  }
})