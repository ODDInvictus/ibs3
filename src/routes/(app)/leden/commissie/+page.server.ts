import db from '$lib/server/db'

export const load = (async () => {
  const committees = await db.committee.findMany()

  return {
    committees
  }
})