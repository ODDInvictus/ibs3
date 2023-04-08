import db from '$lib/server/db'

export const load = (async ({ locals }) => {
  const personData = await db.financialPersonDataUser.findMany({
    include: {
      person: true
    }
  })

  const own = personData.find((p) => p.userId === locals.user.id)

  return {
    persons: personData,
    own
  }
})