import { User } from '@prisma/client'
import { getUsers, prisma } from './prisma'
import { randomString } from './utils'
import { sendEmailNotification } from './email-utils'

export async function syncEmail() {
  log('Syncing email addresses')

  if (!process.env.EMAIL_DOMAIN) {
    log('No email domain set, skipping email sync')
    return
  }

  const api = new MailcowAPI()

  const users = await getUsers()

  // Oke het idee is simpel
  // We slaan in de db iedereen email op, en zorgen ervoor dat daarvoor een mailbox is
  await syncMailboxes(api, users)
  // Vervolgens maken we voor die persoon een filter aan die alle mail doorstuurt naar hun email
  await syncFilters(api, users)

  // Daarna gaan we verder met aliases
  // Eerst synchoniseren we alle commissies (bijv senaat -> daan, naut, sylvan, twan)
  await syncCommittees(api)
  // Daarna alle extra alias groepen (bijv cantus -> niels, naut)
  // en de speciale regels (bijv spotify -> admin of roddels -> cantus, stin -> stin)
  await syncContacts(api)
  // Als laatst de individuele aliases (bijv topking -> naut)
  await syncUserAliases(api)

  // Als laatst, verwijder alle oude aliases uit mailcow
  await removeOldAliases(api)
}

// Werkt (14-7-2023)
// Het verwijderen van mailboxen zal handmatig moeten gebeuren
async function syncMailboxes(api: MailcowAPI, users: User[]) {
  log('Syncing mailboxes')

  const mailboxes = await api.getMailboxes()

  for (const user of users) {
    const ldapId = user.ldapId

    const mailbox = mailboxes.find(mailbox => mailbox.local_part === ldapId)

    if (!mailbox) {
      log(`Creating mailbox for ${ldapId}`)
      await api.createMailbox(ldapId, `${user.firstName} ${user.lastName}`, 'oddinvictus.nl')
    }
  }

}

// Werkt (14-7-2023)
// Het verwijderen van filters zal handmatig moeten gebeuren
async function syncFilters(api: MailcowAPI, users: User[]) {
  log('Syncing filters')

  const noPersonalEmail = users.filter(user => !user.personalEmail)
  const hasPersonalEmail = users.filter(user => user.personalEmail)

  if (noPersonalEmail.length > 0) {
    log('No personal email found for the following users:')
    log(noPersonalEmail.map(user => `${user.firstName} ${user.lastName} (${user.ldapId})`).join(', '))

    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) return

    await sendEmailNotification('Geen persoonlijke email gevonden',
      `
Hoi Admin,

Er zijn een aantal gebruikers zonder persoonlijk email adres gevonden. Dit betekent dat ze geen mail ontvangen op hun persoonlijke email adres.
Het gaat om de volgende mensen:
${noPersonalEmail.map(user => `${user.firstName} ${user.lastName} (${user.ldapId})`).join('\n')}

Persoonlijke email adres kan je in de database instellen onder 'personalEmail'.
Vervolgens zal dit scriptje de filters aanmaken om 7 uur sochtends.

Groetjes,
Invictus Bier Systeem
      `,
      adminEmail
    )
  }

  const filters = await api.getFilters()

  for (const person of hasPersonalEmail) {
    // Check if filter already exists
    const filter = filters.find(f => f.username === `${person.ldapId}@${process.env.EMAIL_DOMAIN}`)

    const personalEmail = person.personalEmail as string

    if (filter) {
      // now we check if the filter is correct
      // if not, update it

      if (!filter.script_data.includes(personalEmail)) {
        log(`Updating filter for ${person.ldapId}`)

        await api.editFilter(filter.id, personalEmail)
      }
      continue
    }

    // if not, create it
    await api.createFilter(`${person.ldapId}@${process.env.EMAIL_DOMAIN}`, personalEmail)
  }
}

// Werkt (14-7-2023)
async function syncCommittees(api: MailcowAPI) {
  log('Syncing committees')
  // Here we need to first create an alias group for each committee
  // Then we need to add all members of that committee to that alias group
  const committees = await prisma.committee.findMany({
    select: {
      name: true,
      id: true,
      ldapId: true,
      CommitteeMember: {
        select: {
          member: {
            select: {
              ldapId: true
            }
          }
        }
      }
    }
  })
  const committeeEmails = await prisma.emailAliasCommittee.findMany()

  const aliases = await api.getAliases()

  for (const committee of committees) {
    const committeeEmail = committeeEmails.find(committeeEmail => committeeEmail.committeeId === committee.id)

    if (!committeeEmail) {
      log(`Creating email alias for committee ${committee.name}`)

      // create an email alias
      const alias = await prisma.emailAlias.create({
        data: {
          alias: committee.ldapId,
        }
      })

      // create the committe object
      await prisma.emailAliasCommittee.create({
        data: {
          committeeId: committee.id,
          emailAliasId: alias.id
        }
      })
    }

    // Then we check if the alias group exists in mailcow
    const alias = aliases.find(alias => alias.address.split('@')[0] === committee.ldapId)

    if (!alias) {
      log(`Creating alias group for committee ${committee.name}`)

      // now we need to get all members of the committee
      const members = await prisma.committeeMember.findMany({
        where: {
          committeeId: committee.id
        },
        select: {
          member: true
        }
      })

      // generate the goto string (comma separated list of email addresses)
      const goto = members.map(member => `${member.member.ldapId}@${process.env.EMAIL_DOMAIN}`).join(',')

      // create the alias group
      await api.createAlias(committee.ldapId, goto, committee.name)
    }
  }

  // Now we update the receivers
  for (const alias of aliases) {
    // check if the alias is a committee alias
    // if it is, check if all members are in the goto
    // if there is someone who should not be in there, remove them from the alias
    // if not, add them to the alias
    const id = alias.address.split('@')[0]

    const committee = committees.find(committee => committee.ldapId === id)

    if (committee) {
      const correctGoto = committee.CommitteeMember.map(member => `${member.member.ldapId}@${process.env.EMAIL_DOMAIN}`).join(',')

      if (correctGoto !== alias.goto) {
        log(`Updating alias ${alias.address} to ${correctGoto}`)

        await api.updateAlias(alias.id, correctGoto)
      }
    }
  }
}

// werkt (15-7-2023)
async function syncContacts(api: MailcowAPI) {
  log('Syncing contacts')
  // First, we get all the userContacts and the aliases

  const emailContacts = await prisma.emailContact.findMany({
    select: {
      EmailAlias: true,
      address: true,
    }
  })

  const aliases = await api.getAliases()

  for (const contact of emailContacts) {
    const alias = aliases.find(alias => alias.address.split('@')[0] === contact.EmailAlias.alias)

    if (!alias) {
      log(`Creating alias for contact ${contact.address}`)

      await api.createAlias(contact.EmailAlias.alias, contact.address, `Alias voor ${contact.address}`)
    }
  }
}

async function syncUserAliases(api: MailcowAPI) {
  log('Syncing user aliases')

  const userAliases = await prisma.emailAliasUser.findMany({
    select: {
      user: true,
      alias: true
    }
  })

  const aliases = await api.getAliases()

  for (const userAlias of userAliases) {
    const alias = aliases.find(alias => alias.address.split('@')[0] === userAlias.alias.alias)

    if (!alias) {
      log(`Creating alias for ${userAlias.user.ldapId}`)

      await api.createAlias(userAlias.alias.alias, `${userAlias.user.ldapId}@${process.env.EMAIL_DOMAIN}`, `Alias voor ${userAlias.user.ldapId}`)
      return
    }

    // Now we check if the goto address is correct
    if (!alias.goto.includes(`${userAlias.user.ldapId}@${process.env.EMAIL_DOMAIN}`)) {
      log(`Updating alias for ${userAlias.user.ldapId}`)

      await api.updateAlias(alias.id, `${userAlias.user.ldapId}@${process.env.EMAIL_DOMAIN}`)
    }
  }
}

// werkt (15-7-2023)
async function removeOldAliases(api: MailcowAPI) {
  log('Removing old aliases')

  // Select all IBS-managed aliases
  const aliases = (await api.getAliases()).filter(alias => alias.private_comment === 'ibs')

  // Select all aliases from the database
  const emailAliases = await prisma.emailAlias.findMany()

  // Now, we need to check which ibs-managed aliases are not in the database
  // Then delete them in mailcow
  for (const alias of aliases) {
    const emailAlias = emailAliases.find(emailAlias => emailAlias.alias === alias.address.split('@')[0])

    if (!emailAlias) {
      log(`Removing alias ${alias.address}`)

      await api.removeAlias(alias.id)
    }
  }
}

function log(message: unknown) {
  if (Object.keys(message as object).length > 0) {
    return console.log(`[EMAIL]`, message)
  }

  console.log(`[EMAIL] ${message}`)
}

class MailcowAPI {
  private url: string
  private key: string

  constructor() {
    log('Initializing Mailcow API')

    const { MAILCOW_API_URL, MAILCOW_API_KEY } = process.env

    if (!MAILCOW_API_URL || !MAILCOW_API_KEY) {
      throw new Error('Missing required environment variables')
    }

    this.url = MAILCOW_API_URL
    this.key = MAILCOW_API_KEY
  }

  private fetch(path: string, options: RequestInit = { method: 'GET' }) {
    return fetch(`${this.url}${path}`, {
      headers: {
        'X-API-Key': this.key,
        'Content-Type': 'application/json'
      },
      ...options
    })
  }

  private async get(path: string) {
    const response = await this.fetch(path)
    return await response.json()
  }

  private async post(path: string, body: unknown) {
    const response = await this.fetch(path, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message)
    }

    return json
  }

  async getMailboxes(): Promise<SimpleMailbox[]> {
    const res = await this.get('/api/v1/get/mailbox/all')

    if (Object.keys(res).length === 0) {
      return []
    }

    return res
  }

  async createMailbox(ldapId: string, fullName: string, domain: string): Promise<SimpleMailbox> {
    const password = randomString(32)

    const obj = {
      local_part: ldapId,
      domain,
      name: fullName,
      quota: 30,
      password,
      password2: password,
      active: '1'
    }

    const response = await this.post('/api/v1/add/mailbox', obj)

    log(response)

    return response
  }

  async getAliases(): Promise<Alias[]> {
    const aliases = await this.get('/api/v1/get/alias/all')

    if (Object.keys(aliases).length === 0) {
      return []
    }

    return aliases
  }

  async createAlias(address: string, goto: string, name: string) {
    // Maak alias aan met /api/v1/add/alias
    const res = await this.post('/api/v1/add/alias', {
      address: `${address}@${process.env.EMAIL_DOMAIN}`,
      goto,
      active: "1",
      sogo_visible: "1",
      private_comment: "ibs",
      public_comment: name,
    })

    log(res)
  }

  async updateAlias(alias_id: number, goto: string) {
    const edit = await this.post('/api/v1/edit/alias', {
      attr: {
        goto
      },
      items: [
        '' + alias_id
      ]
    })

    log(edit)

    return edit
  }

  async removeAlias(alias_id: number) {
    const remove = await this.post('/api/v1/delete/alias', {
      id: alias_id
    })

    log(remove)

    return remove
  }

  async getFilters(): Promise<Filter[]> {
    const filters = await this.get('/api/v1/get/filters/all')

    if (Object.keys(filters).length === 0) {
      return []
    }

    return filters
  }

  async createFilter(email: string, personalEmail: string) {
    const filter = `
redirect "${personalEmail}";
keep;`

    const res = await this.post('/api/v1/add/filter', {
      username: email,
      active: "1",
      script_data: filter,
      script_desc: "forward",
      filter_type: "prefilter",
    })

    log(res)
  }

  async editFilter(id: number, personalEmail: string) {
    const filter = `
redirect "${personalEmail}";
keep;`

    const res = await this.post('/api/v1/edit/filter', {
      items: [
        '' + id
      ],
      attr: {
        script_data: filter
      }
    })

    log(res)
  }
}

type SimpleMailbox = {
  username: string
  name: string
  active: string
  domain: string
  local_part: string
}

type Alias = {
  in_primary_domain: string
  id: number
  domain: string
  public_comment: string
  private_comment: string
  goto: string // comma separated list of email addresses
  address: string // local_part@domain.tld
  is_catch_all: number
  active: number
  active_int: number
  sogo_visible: number
  sogo_visible_int: number
  created: string
  modified: string
}

type Filter = {
  active: number,
  id: number,
  username: string,
  filter_type: 'prefilter' | 'postfilter',
  script_data: string,
  script_desc: string,
}