import { CronJob } from 'quirrel/sveltekit'

export default CronJob(
  "jobs/ldap/sync",
  // Draai elke hele uur, (bijv. 20:00 en 21:00)
  ["0 * * * *", "Europe/Amsterdam"],
  async (job) => {
    console.log('[LDAP] Syncing groups...')

  }
)