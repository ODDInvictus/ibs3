import { env } from '$env/dynamic/private'
import type { RequestEvent } from '@sveltejs/kit'

export const notifyDiscordText = async (webhookUrl: string, text: string): Promise<void> => {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: text
    })
  })
}

export const notifyDiscordError = async (webhookUrl: string, obj: Record<string, unknown>): Promise<void> => {
  const err = obj.error as Error
  const event = obj.event as RequestEvent<Partial<Record<string, string>>, string | null>

  const embed = {
    title: err.name ?? 'Error',
    color: 0xff0000,
    description: err.message,
    fields: [
      {
        name: 'URL',
        value: event.url.href
      },
      {
        name: 'User',
        value: event.locals.user?.email ?? 'Niet ingelogd'
      }
    ],
    author: {
      name: 'Invictus Bier Systeem',
      url: env.ORIGIN
    },
    footer: {
      text: new Date().toLocaleString('nl-NL')
    }
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [embed]
    })
  })
}