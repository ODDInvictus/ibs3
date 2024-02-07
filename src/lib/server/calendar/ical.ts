import { AttendingStatus } from '@prisma/client'
import db from '../db'
import ics from 'ics'
import type { ParticipationStatus } from 'ics'
import { activitySlug } from '$lib/textUtils'

// https://icalendar.org/validator.html#results

export async function generateActivityIcal() {
  // Get all upcoming activities
  const activities = await db.activity.findMany({
    where: {
      startTime: {
        gte: new Date()
      }
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

  activities.forEach(activity => {
    const hours = Math.abs(activity.endTime.getTime() - activity.startTime.getTime()) / 36e5
    const minutes = Math.abs(activity.endTime.getTime() - activity.startTime.getTime()) / 6e4

    let description = activity.description ?? 'Geen beschrijving'
    description += '\n\nLees meer op ' + process.env.ORIGIN + '/activiteit/' + activitySlug(activity.name) + '/' + activity.id


    const event: ics.EventAttributes = {
      uid: `${activity.id}-${activitySlug(activity.name)}@${process.env.EMAIL_DOMAIN}`,
      start: [activity.startTime.getFullYear(), activity.startTime.getMonth() + 1, activity.startTime.getDate(), activity.startTime.getHours(), activity.startTime.getMinutes()],
      end: [activity.endTime.getFullYear(), activity.endTime.getMonth() + 1, activity.endTime.getDate(), activity.endTime.getHours(), activity.endTime.getMinutes()],
      // duration: { hours, minutes },
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
      // TODO:
      // Dit werkt niet, want we hebben geen google workspace
      // attendees: activity.attending.map(member => {
      //   let name;
      //   if (member.user.nickname) {
      //     name = `${member.user.firstName} \`${member.user.nickname}\` ${member.user.lastName}`
      //   } else {
      //     name = `${member.user.firstName} ${member.user.lastName}`
      //   }

      //   let partstat: ParticipationStatus

      //   switch (member.status) {
      //     case AttendingStatus.ATTENDING:
      //       partstat = 'ACCEPTED'
      //       break
      //     case AttendingStatus.NOT_ATTENDING:
      //       partstat = 'DECLINED'
      //       break
      //     case AttendingStatus.UNSURE:
      //       partstat = 'TENTATIVE'
      //       break
      //     case AttendingStatus.NO_RESPONSE:
      //       partstat = 'NEEDS-ACTION'
      //       break
      //   }

      //   return {
      //     name,
      //     email: member.user.email,
      //     role: 'OPT-PARTICIPANT',
      //     partstat
      //   }
      // })
    }

    events.push(event)
  })

  console.log(events)

  members.forEach(member => {
    if (!member.birthDate) return

    const event: ics.EventAttributes = {
      recurrenceRule: "FREQ=YEARLY",
      uid: `${member.ldapId}-verjaardag@${process.env.EMAIL_DOMAIN}`,
      start: [member.birthDate.getFullYear(), member.birthDate.getMonth() + 1, member.birthDate.getDate()],
      duration: { days: 1 },
      title: `${member.firstName} jarig`,
      description: `${member.firstName} dit is je verjaardag, je verjaardag gaat zomaar niet voorbij!`,
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

    events.push(event)
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