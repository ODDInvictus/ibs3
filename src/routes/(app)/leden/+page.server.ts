import db from '$lib/server/db'

export const load = (async () => {
  const members = await db.user.findMany()

  return {
    members
  }
})