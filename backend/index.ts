// Express based backend for job scheduling
import express from 'express'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { syncEmail } from './email';
import { syncLDAPUsers } from './ldap';

const API_VERSION = '1.0.1'

/*
  EXPRESS
*/

dotenv.config()

const app = express()
const port = process.env.BACKEND_PORT || 3000

app.get('/version', (req, res) => res.json({ version: API_VERSION }))

app.listen(port, async () => {
  console.log(`Job scheduler listening at http://localhost:${port}`)
})

/*
  CRONJOBS
*/

// Sync LDAP every day at 6:00
cron.schedule('0 6 * * *', syncLDAPUsers)
// Sync email every day at 7:00
cron.schedule('0 7 * * *', syncEmail)