import { AttendingStatus } from '@prisma/client'
import db from '../db'
import ics from 'ics'
import type { ParticipationStatus } from 'ics'

export async function generateActivityIcal() {
  // Get all upcoming activities
  const activities = await db.activity.findMany({
    where: {
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

    const event: ics.EventAttributes = {
      start: [activity.startTime.getFullYear(), activity.startTime.getMonth() + 1, activity.startTime.getDate()],
      end: [activity.endTime.getFullYear(), activity.endTime.getMonth() + 1, activity.endTime.getDate()],
      duration: { hours, minutes },
      title: activity.name,
      description: activity.description,
      location: activity.location?.name ?? 'Locatie onbekend',
      url: process.env.ORIGIN + '/activiteit/' + activity.id,
      categories: ['O.D.D. Invictus', 'Activiteit'],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: {
        name: activity.organisedBy.name,
        email: `${activity.organisedBy.ldapId}@${process.env.EMAIL_DOMAIN}`
      },
      attendees: activity.attending.map(member => {
        let name;
        if (member.user.nickname) {
          name = `${member.user.firstName} "${member.user.nickname}" ${member.user.lastName}`
        } else {
          name = `${member.user.firstName} ${member.user.lastName}`
        }

        let partstat: ParticipationStatus

        switch (member.status) {
          case AttendingStatus.ATTENDING:
            partstat = 'ACCEPTED'
            break
          case AttendingStatus.NOT_ATTENDING:
            partstat = 'DECLINED'
            break
          case AttendingStatus.UNSURE:
            partstat = 'TENTATIVE'
            break
          case AttendingStatus.NO_RESPONSE:
            partstat = 'NEEDS-ACTION'
            break
        }

        return {
          name,
          email: member.user.email,
          role: 'OPT-PARTICIPANT',
          partstat
        }
      })
    }

    events.push(event)
  })

  console.log(events)

  members.forEach(member => {
    if (!member.birthDate) return
    const date: [number, number, number] = [member.birthDate.getFullYear(), member.birthDate.getMonth(), member.birthDate.getDate()]

    const event: ics.EventAttributes = {
      start: [member.birthDate.getFullYear(), member.birthDate.getMonth() + 1, member.birthDate.getDate()],
      end: [member.birthDate.getFullYear(), member.birthDate.getMonth() + 1, member.birthDate.getDate() + 1],
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

    // events.push(event)
  })

  // Generate iCal
  const { error, value } = ics.createEvents(events, {
    calName: 'O.D.D. Invictus',
  })

  if (error) throw error

  return value
}