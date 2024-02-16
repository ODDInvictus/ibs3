import type { Activity, Attending, Committee, User } from '@prisma/client'
import db from '../db'
import ics from 'ics'
import type { ParticipationStatus } from 'ics'
import { activitySlug } from '$lib/textUtils'
import { LDAP_IDS } from '$lib/constants'

// https://icalendar.org/validator.html#results

// TODO: Authenticatie
// TODO: Persoonlijk bericht

type EventActivity = Activity & {
  attending: Attending & {
    user: User
  }[],
  location: Location,
  organisedBy: Committee,
}

export class ICalService {

  /**
   * Generate an iCal file for a specific activity
   */
  async generateActivityIcal(activityId: number) {
    const activity = await db.activity.findUnique({
      where: {
        id: activityId
      },
      include: {
        location: true,
        organisedBy: true,
        attending: {
          include: {
            user: true
          }
        }
      }
    })

    if (!activity) throw new Error('Activiteit niet gevonden')

    const event = this.getActivityIcal(activity as unknown as EventActivity)

    const { error, value } = ics.createEvent(event)

    if (error) throw error

    return value
  }

  /**
   * Generate an iCal file for all upcoming activities and member birthdays
   */
  async generateCommonIcal(user?: User) {
    let committees: Committee[] = []

    // Check the users status
    if (user) {
      const cms = await db.user.findFirst({
        where: {
          id: user.id
        },
        select: {
          CommitteeMember: {
            select: {
              committee: true
            }
          }
        }
      })
      cms?.CommitteeMember.forEach(cm => committees.push(cm.committee))
    }

    let query = {
      where: {
        startTime: {
          gte: new Date()
        },
      },
      include: {
        location: true,
        organisedBy: true,
        attending: {
          include: {
            user: true
          }
        }
      }
    }

    const isFeut = committees.find(c => c.ldapId === LDAP_IDS.FEUTEN)

    if (isFeut) {
      query = Object.assign(query, {
        where: {
          membersOnly: false
        }
      })
    }

    // Get all upcoming activities
    const activities = await db.activity.findMany(query) as unknown as EventActivity[]

    // Get all members except user 0 "Verwijderd"
    const members = await db.user.findMany({
      where: {
        id: {
          gte: 1
        }
      }
    })

    // Create events
    const events: ics.EventAttributes[] = []

    // Generate the calendar events for activities and birthdays
    activities.forEach(activity => {
      const event = this.getActivityIcal(activity)
      if (event) events.push(event)
    })

    members.forEach(member => {
      const birthday = this.getBirthdayIcal(member, user!)
      if (birthday) events.push(birthday)
    })

    // Generate iCal
    const { error, value } = ics.createEvents(events, {
      calName: 'O.D.D. Invictus',
      productId: '//ODDInvictus//ibs3//NL',
      method: 'PUBLISH',
    })

    if (error) throw error

    return value
  }

  private getActivityIcal(activity: EventActivity) {
    let description = activity.description ?? 'Geen beschrijving'
    description += '\n\nLees meer op ' + process.env.ORIGIN + '/activiteit/' + activitySlug(activity.name) + '/' + activity.id

    const event: ics.EventAttributes = {
      uid: `${activity.id}-${activitySlug(activity.name)}@${process.env.EMAIL_DOMAIN}`,
      start: [activity.startTime.getFullYear(), activity.startTime.getMonth() + 1, activity.startTime.getDate(), activity.startTime.getHours(), activity.startTime.getMinutes()],
      end: [activity.endTime.getFullYear(), activity.endTime.getMonth() + 1, activity.endTime.getDate(), activity.endTime.getHours(), activity.endTime.getMinutes()],
      title: activity.name,
      description,
      location: activity.location?.name ?? 'Locatie onbekend',
      // Not supported by Google nor Proton
      // url: process.env.ORIGIN + '/activiteit/' + activity.id,
      categories: ['\"O.D.D. Invictus\"', 'Activiteit'],
      status: 'CONFIRMED',
      // busyStatus: 'BUSY',
      organizer: {
        name: activity.organisedBy.name,
        email: `${activity.organisedBy.ldapId}@${process.env.EMAIL_DOMAIN}`
      },
    }

    return event
  }

  private getBirthdayIcal(member: User, currentUser: User): ics.EventAttributes | null {
    if (!member.birthDate) return null

    let message = `${member.firstName} dit is je verjaardag, je verjaardag gaat zomaar niet voorbij!`

    if (currentUser && member.ldapId === currentUser.ldapId) {
      message = `Gefeliciteerd ${member.firstName}, vandaag ben je jarig! De volgende borrel krijg je een biertje van ons 🍻`
    }

    const event: ics.EventAttributes = {
      recurrenceRule: "FREQ=YEARLY",
      uid: `${member.ldapId}-verjaardag@${process.env.EMAIL_DOMAIN}`,
      start: [member.birthDate.getFullYear(), member.birthDate.getMonth() + 1, member.birthDate.getDate()],
      duration: { days: 1 },
      title: `${member.firstName} jarig`,
      description: message,
      location: 'Bakken vouwen',
      url: process.env.ORIGIN + '/leden/' + member.ldapId,
      categories: ['O.D.D. Invictus', 'Verjaardag', 'Bakken vouwen'],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: {
        name: 'O.D.D. Invictus',
        email: 'ibs@' + process.env.EMAIL_DOMAIN
      },
      attendees: [
        {
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          role: 'REQ-PARTICIPANT',
          partstat: 'ACCEPTED'
        }
      ]
    }

    return event
  }

}