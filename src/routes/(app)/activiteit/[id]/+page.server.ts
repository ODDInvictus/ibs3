import db from '$lib/server/db'

export const load = (async ({ params }) => {
  const activity = await db.activity.findFirstOrThrow({
    where: {
      id: parseInt(params.id)
    },
    include: {
      attending: true,
      organisedBy: true,
      location: true,
    }
  })

  return {
    activity
  }
})