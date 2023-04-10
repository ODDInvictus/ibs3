import db from '$lib/server/db'

export const load = (async ({ params }) => {
  const id = parseInt(params.slug.split('-')[0])

  const location = await db.activityLocation.findFirstOrThrow({
    where: {
      id
    }
  })

  return {
    location
  }
})