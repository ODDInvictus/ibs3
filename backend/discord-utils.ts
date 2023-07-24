type Embed = {
  title: string
  description: string
  color: number
  thumbnail?: Thumbnail
  fields: EmbedField[]
}

type Thumbnail = {
  url: string
}

type EmbedField = {
  name?: string
  value?: string
}


export async function sendNotification(embed: Embed) {
  const url = process.env.DISCORD_IBS_WEBHOOK

  if (!url) {
    console.log('[DISCORD] No webhook found')
    return
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'Invictus Bier Systeem',
      embeds: [embed]
    })
  })
}