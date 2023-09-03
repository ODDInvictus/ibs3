import db from '$lib/server/db'

export const load = (async ({ params }) => {
  const location = await db.activityLocation.findFirstOrThrow({
    where: {
      id: parseInt(params.id)
    }
  })

  return {
    location,
    title: location.name,
  }
})