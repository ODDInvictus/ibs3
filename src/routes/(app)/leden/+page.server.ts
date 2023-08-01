import { LDAP_IDS } from '$lib/constants'
import db from '$lib/server/db'

export const load = (async () => {
  const members = db.user.findMany({
    where: {
      isActive: true,
      CommitteeMember: {
        some: {
          committee: {
            ldapId: LDAP_IDS.MEMBERS
          }
        }
      }
    }
  })

  const feuten = db.user.findMany({
    where: {
      isActive: true,
      CommitteeMember: {
        some: {
          committee: {
            ldapId: LDAP_IDS.FEUTEN
          }
        }
      }
    },
  })

  return {
    members,
    feuten
  }
})