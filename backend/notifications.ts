import { Activity } from '@prisma/client';
import { sendNotification } from './discord-utils';
import { prisma } from './prisma';
import { sendEmailNotificationFrontend } from './email-utils';
import { getPreference } from './preference-utils';

function log(...args: any[]) {
  console.log('[NOTIFICATIONS]', ...args)
}

export async function newActivitiyNotification(activity: Activity) {
  log('New activity made! Sending notifications');

  let location = undefined

  if (activity.locationId) {
    const l = await prisma.activityLocation.findFirst({
      where: {
        id: activity.locationId
      }
    })

    if (l) {
      location = l.name
    }
  }

  if (activity.membersOnly) {
    log('Activity is members only, only sending email notifications');
    await newActivityEmail(activity, location, true)
    return
  }


  log('Sending discord notification');
  await newActivityDiscord(activity, location)
  log('Sending email notification');
  await newActivityEmail(activity, location)
}

async function newActivityDiscord(activity: Activity, location?: string) {
  const fields = [
    {
      name: 'Datum',
      value: activity.startTime.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
  ]

  if (location) {
    fields.push({
      name: 'Locatie',
      value: location
    })
  }

  fields.push({
    name: 'Meer informatie en aanmelden',
    value: `${process.env.IBS_URL}/activiteit/${activity.id}`
  })

  const obj = {
    title: `Nieuwe activiteit: ${activity.name}`,
    description: activity.description,
    color: 0x8800bb,
    fields: fields,
    thumbnail: {
      url: `${process.env.PUBLIC_UPLOAD_URL}/activities${activity.image ?? 'activiteit-0-logo.png'}`
    }
  }

  await sendNotification(obj)
}

async function newActivityEmail(activity: Activity, location?: string, membersOnly = false) {
  // First get the list of users who want to receive these emails
  const preferences = await getPreference('email_new_activity', membersOnly)

  const users = preferences.map(p => p.user)

  if (users.length === 0) {
    return
  }

  const committee = await prisma.committee.findFirst({
    where: {
      id: activity.committeeId
    },
    select: {
      name: true,
      ldapId: true
    }
  })

  for (const u of users) {

    log('Trying to send an email to user:', u.ldapId)

    await sendEmailNotificationFrontend('new-activity', u, {
      activity,
      location,
      committee,
      date: activity.startTime.toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' }) + ' om ' + activity.startTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    })
  }
}