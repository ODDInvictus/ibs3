import type { User } from '@prisma/client';
import { prisma } from './prisma';

export async function syncLDAPUsers() {
  console.log('[LDAP] Syncing LDAP users')

  const ibsUsers: User[] = await prisma.user.findMany()

  let ibsGroups = await prisma.committee.findMany({ where: { isActive: true } })
  const ibsGroupMembers = await prisma.committeeMember.findMany({
    where: { OR: [{ leaveDate: undefined }, { leaveDate: null }] }
  })
  const authentikGroups = await authentikAPI.getGroups()

  // First add groups and users to groups that don't exist yet
  for (const group of authentikGroups) {
    // First check if the group exists in IBS
    let ibsGroup = ibsGroups.find((ibsGroup) => ibsGroup.ldapId === group.name)

    // If it doesn't exist, create it in IBS
    if (!ibsGroup) {
      console.log('[LDAP] Creating group', group.name)
      ibsGroup = await prisma.committee.create({
        data: {
          name: group.name,
          ldapId: group.name,
        }
      })

      if (!ibsGroup) {
        // Something went wrong, just crash
        throw new Error(`[LDAP] Failed to create group ${group.name}`)
      }
    }

    // Then check if the group members are up to date
    for (const member of group.users_obj) {
      // first check if the user has already logged into IBS at least once
      const ibsUser = ibsUsers.find((ibsUser) => ibsUser.ldapId === member.username)

      if (!ibsUser) {
        // User hasn't logged in yet, skip
        continue
      }

      // Then check if the user is already a member of the group
      const ibsGroupMember = ibsGroupMembers.find((ibsGroupMember) => ibsGroupMember.userId === ibsUser.id && ibsGroupMember.committeeId === ibsGroup?.id)


      if (!ibsGroupMember) {
        console.log('[LDAP] Adding user', member.username, 'to group', ibsGroup.id)
        // User is not a member of the group, add them
        await prisma.committeeMember.create({
          data: {
            committeeId: ibsGroup.id,
            userId: ibsUser.id,
            function: 'Algemeen lid',
            joinDate: new Date(),
          }
        }).catch(console.error)
      }
    }
  }

  // Then remove groups and users from groups that shouldn't exist anymore

  // TODO

  // All done with groups!
  console.log('[LDAP] Done syncing groups')

  console.log('[LDAP] Syncing financial people')

  const financialPeople = await prisma.financialPerson.findMany({ where: { isActive: true } })
  const financialPeopleDataUser = await prisma.financialPersonDataUser.findMany()

  // Add a FinancialPerson for every user that doesn't have one yet
  for (const user of ibsUsers) {
    const financialPersonData = financialPeopleDataUser.find((financialPersonDataUser) => financialPersonDataUser.userId === user.id)

    // A record has been found, we can continue
    if (financialPersonData) continue

    // Create a new record
    try {
      const fp = await prisma.financialPerson.create({
        data: {
          name: user.firstName + " " + user.lastName,
          type: 'USER',
          balance: 0,
          isActive: true
        }
      })

      await prisma.financialPersonDataUser.create({
        data: {
          userId: user.id,
          personId: fp.id
        }
      })
    } catch (err) {
      console.error('[LDAP] Failed to create financial person for user', user.id)
    }

  }

  ibsGroups = await prisma.committee.findMany({ where: { isActive: true } })
  const financialPeopleDataCommittee = await prisma.financialPersonDataCommittee.findMany()

  // Add a FinancialPerson for every committee that doesn't have one yet

  for (const group of ibsGroups) {
    const financialPersonData = financialPeopleDataCommittee.find((financialPersonDataCommittee) => financialPersonDataCommittee.committeeId === group.id)

    // A record has been found, we can continue
    if (financialPersonData) continue

    // Create a new record
    try {
      const fp = await prisma.financialPerson.create({
        data: {
          name: group.name,
          type: 'COMMITTEE',
          balance: 0,
          isActive: true
        }
      })

      await prisma.financialPersonDataCommittee.create({
        data: {
          committeeId: group.id,
          personId: fp.id
        }
      })
    } catch (err) {
      console.error('[LDAP] Failed to create financial person for group', group.id)
    }
  }

  // Done!
  console.log('[LDAP] Done syncing financial people')
}

/*
  AUTHENTIK
*/
const { AUTHENTIK_BASE_URL, AUTHENTIK_GROUP_NAME, AUTHENTIK_TOKEN } = process.env

class AuthentikAPI {
  private url: string
  private token: string
  private groupName: string

  constructor() {
    this.url = AUTHENTIK_BASE_URL ?? ''
    this.token = AUTHENTIK_TOKEN ?? ''
    this.groupName = AUTHENTIK_GROUP_NAME ?? ''
  }

  private fetch(url: string, method = 'GET', body: Record<string, unknown> = {}) {
    let options = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      method,
    }

    if (method !== 'GET') {
      options = Object.assign(options, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    }

    return fetch(url, options)
  }

  async getUsers() {
    const response = await this.fetch(`${this.url}/core/groups/?name=${this.groupName}`)
    const json = await response.json()

    if (json.results.length === 0) {
      throw new Error(`Group ${this.groupName} not found`)
    }

    const group = json.results[0]

    return group.users_obj
  }

  async getGroups() {
    const response = await this.fetch(`${this.url}/core/groups/`)
    const json = await response.json()

    if (json.results.length === 0) {
      throw new Error(`No groups found`)
    }

    const groups = json.results.filter((group: Record<string, unknown>) => group.parent_name === 'commissie')

    return groups
  }
}

const authentikAPI = new AuthentikAPI()