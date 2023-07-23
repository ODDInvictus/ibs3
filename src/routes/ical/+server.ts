import db from '$lib/server/db'
import { formatDate } from '$lib/utils'
import type { Activity, ActivityLocation } from '@prisma/client'

type Event = Activity & { location: ActivityLocation | null }

export async function GET() {

  // TODO: filter out non-member activities

  const activities = await db.activity.findMany({
    include: {
      location: true
    }
  })


  return generateDynamicICal(activities)
}


function generateDynamicICal(activities: Event[]): string {
  const body: string[] = []

  body.push('BEGIN:VCALENDAR')
  body.push('VERSION:2.0')
  body.push('PRODID:-//O.D.D. Invictus//Invictus Bier Systeem//NL')

  // Add all activities as events
  activities.forEach(activity => body.push(...generateEvent(activity)))

  body.push('END:VCALENDAR')

  return `data:text/calendar;charset=utf8,${encodeURIComponent(body.join('\n'))}`
}

function generateEvent(activity: Event): string[] {
  const body: string[] = []

  const endTime: Date = activity.endTime ?? new Date(activity.startTime.getTime())

  if (!activity.endTime) {
    endTime.setHours(endTime.getHours() + 1)
  }

  const st = formatDate(activity.startTime)

  body.push('BEGIN:VEVENT')
  body.push(`DTSTAMP:${st}`)
  body.push(`DTSTART:${st}`)
  body.push(`UID:uid_${activity.id}.ical@oddinvictus.nl`)
  body.push(`SUMMARY:${activity.name}`)
  body.push(`DTEND:${formatDate(endTime)}`)
  if (activity.url) body.push(`URL:${activity.url}`)
  if (activity.description) body.push(`DESCRIPTION:${activity.description} \n ${activity.url}`)
  if (activity.location) body.push(`LOCATION:${activity.location.name}\\, ${activity.location.adress}`)
  body.push('END:VEVENT')

  return body

}