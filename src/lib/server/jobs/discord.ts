import { Queue } from 'quirrel/sveltekit'
import { DISCORD_NOTIFICATION_WEBHOOK } from '$env/static/private'
import { notifyDiscordError } from '../notifications/discord'

export const discordLogger = Queue(
  "jobs/notifications/discord",
  async (job, meta) => {
    await notifyDiscordError(DISCORD_NOTIFICATION_WEBHOOK, job)
  },
)