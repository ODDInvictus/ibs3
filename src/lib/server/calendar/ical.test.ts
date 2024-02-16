import { expect, test } from 'vitest'
import { ICalService } from './ical'
import db from '$lib/server/db'

const ical = new ICalService()

function amountOfVEvents(ical: string) {
  return (ical.match(/BEGIN:VEVENT/g) || []).length
}

function amountOfBirthdays(ical: string) {
  return (ical.match(/Verjaardag/g) || []).length
}

function amountOfActivities(ical: string) {
  return (ical.match(/CATEGORIES:"O.D.D. Invictus",Activiteit/g) || []).length
}

test('generic ical', async () => {
  const cal = await ical.generateCommonIcal()

  // 6 birthdays, 3 activities
  expect(amountOfVEvents(cal!)).toBe(9)
  expect(amountOfBirthdays(cal!)).toBe(6)
  expect(amountOfActivities(cal!)).toBe(3)
})

test('ical generated with only members', async () => {
  const user = await db.user.findFirst({
    where: { id: 1 }
  })

  const cal = await ical.generateCommonIcal(user!)
  // 6 birthdays, 3 activities
  expect(amountOfVEvents(cal!)).toBe(9)
  expect(amountOfBirthdays(cal!)).toBe(6)
  expect(amountOfActivities(cal!)).toBe(3)
})

test('ical for pre-members', async () => {
  const user = await db.user.findFirst({
    where: { id: 4 }
  })

  const cal = await ical.generateCommonIcal(user!)
  // 6 birthdays, 2 activities
  expect(amountOfVEvents(cal!)).toBe(8)
  expect(amountOfBirthdays(cal!)).toBe(6)
  expect(amountOfActivities(cal!)).toBe(2)
})

test('personal ical', async () => {
  const user = await db.user.findFirst({
    where: { id: 1 }
  })

  const cal = await ical.generateCommonIcal(user!)

  // Check if the birthday message is in there
  const msg = `Gefeliciteerd ${user!.firstName}`

  expect(cal).toContain(msg)
})

test('seperate ical for all activities', async () => {
  const ical = new ICalService()

  const activities = await db.activity.findMany()

  for (const activity of activities) {
    // throws error if not working
    await ical.generateActivityIcal(activity.id)
  }
})