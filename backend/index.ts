// Express based backend for job scheduling
import express from 'express'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { syncEmail } from './email';
import { syncLDAPUsers } from './ldap';
import { verdubbelStrafbakken } from './strafbakken';
import { prisma } from './prisma';
import { newActivitiyNotification } from './notifications';
import { sendCustomEmail } from './email-utils';

const API_VERSION = '1.0.1'

/*
  EXPRESS
*/

dotenv.config()

const app = express()
const port = process.env.BACKEND_PORT || 3000

app.use(express.json())

app.get('/version', (req, res) => res.json({ version: API_VERSION }))

app.post('/notify/activity/:id', async (req, res) => {
  const id = req.params.id

  const activity = await prisma.activity.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!activity) {
    res.sendStatus(404)
    return
  }

  // Now return to the client
  res.sendStatus(200)

  // Send notifications
  await newActivitiyNotification(activity)
})

app.post('/email/send', async (req, res) => {
  const b = req.body

  if (!b.to || !b.subject || !b.from || !b.text || !b.toName || !b.fromName || !b.senderFirstName) {
    res.sendStatus(400)
    return
  }

  const { to, from, subject, text, toName, fromName, senderFirstName } = req.body

  // Now return to the client
  res.sendStatus(200)

  // Send email
  await sendCustomEmail({ subject, to, from, text, toName, fromName, senderFirstName })
})

app.listen(port, async () => {
  console.log(`Job scheduler listening at http://localhost:${port}`)
})

/*
  CRONJOBS
*/

// Sync LDAP every day at 6:00
const cronLdap = process.env.CRONTAB_LDAP || '0 6 * * *'
console.log('[CRONTAB]', 'LDAP sync running at', cronLdap)
cron.schedule(cronLdap, syncLDAPUsers)

// Sync email every day at 7:00
const cronEmail = process.env.CRONTAB_EMAIL || '0 7 * * *'
console.log('[CRONTAB]', 'Email sync running at', cronEmail)
cron.schedule(cronEmail, syncEmail)

// Verdubbel strafbakken every first of the month at 0:00
const cronStrafbakken = process.env.CRONTAB_STRAFBAKKEN || '0 0 1 * *'
console.log('[CRONTAB]', 'Strafbakken verdubbelen running at', cronStrafbakken)
cron.schedule(cronStrafbakken, verdubbelStrafbakken)