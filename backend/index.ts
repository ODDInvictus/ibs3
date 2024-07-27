// Express based backend for job scheduling
import express from 'express'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { verdubbelStrafbakken } from './strafbakken'
import { prisma } from './prisma'
import { newActivitiyNotification } from './notifications'
import { sendCustomEmail } from './email-utils'
import redis from './redis'
import { ImageProcessing } from './images'
import { failJob } from './utils'

const API_VERSION = '1.0.1'

/*
	EXPRESS
*/

dotenv.config()

const app = express()
const port = process.env.BACKEND_PORT || 3000

app.use(express.json())

app.get('/version', (req, res) => res.json({ version: API_VERSION }))

app.post('/email/send', async (req, res) => {
	const b = req.body

	if (!b.to || !b.subject || !b.from || !b.text || !b.toName || !b.fromName || !b.senderFirstName) {
		res.sendStatus(400)
		return
	}

	const { to, from, subject, text, toName, fromName, senderFirstName } = req.body

	// Now return to the client
	res.sendStatus(200)

	console.log(`Attempted to send an email to ${to} with subject ${subject}`)
	// console.log('Skipping...')

	// Send email
	await sendCustomEmail({ subject, to, from, text, toName, fromName, senderFirstName })
})

app.listen(port, async () => {
	console.log(`Job scheduler listening at http://localhost:${port}`)

	if (process.env.DISABLE_REDIS === 'true') {
		console.log('[REDIS] Redis is disabled, jobs will not be processed')
		return
	}

	console.log('Connecting to redis...')
	await redis.connect()
	console.log('[REDIS] Listening for jobs')

	await redis.subscribe('new-activity', async msg => {
		if (!msg) return

		const body = JSON.parse(msg)

		console.log('[REDIS] Received new-activity job', body.data)

		const aid = Number.parseInt(body.data)

		const activity = await prisma.activity.findUnique({
			where: {
				id: aid,
			},
		})

		if (!activity) {
			console.log('[REDIS] Invalid activity id')
			await failJob(body.name, 'Activiteit niet gevonden')
			return
		}

		// Now send out the discord notification and emails
		await newActivitiyNotification(activity)
	})

	await redis.subscribe('compress-image', async msg => {
		if (!msg) {
			console.error('[REDIS] Received message for compress-image but no data was provided')
			return
		}
		const body = JSON.parse(msg)

		await ImageProcessing.compressImage(body)
	})

	await redis.subscribe('rotate-image', async msg => {
		if (!msg) {
			console.error('[REDIS] Received message for rotate-image but no data was provided')
			return
		}
		const body = JSON.parse(msg)

		await ImageProcessing.rotateImage(body)
	})
})

/*
	CRONJOBS
*/

// Sync email every day at 7:00
// const cronEmail = process.env.CRONTAB_EMAIL || '0 7 * * *'
// console.log('[CRONTAB]', 'Email sync running at', cronEmail)
// cron.schedule(cronEmail, syncEmail)

// Verdubbel strafbakken every first of the month at 0:00
const cronStrafbakken = process.env.CRONTAB_STRAFBAKKEN || '0 0 1 * *'
console.log('[CRONTAB]', 'Strafbakken verdubbelen running at', cronStrafbakken)
cron.schedule(cronStrafbakken, verdubbelStrafbakken)

// TODO rerun jobs that failed
