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