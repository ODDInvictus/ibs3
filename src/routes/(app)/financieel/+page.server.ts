import db from '$lib/server/db'

export const load = (async ({ locals }) => {
  const personData = await db.financialPersonDataUser.findFirst({
    where: {
      userId: locals.user.id
    },
    include: {
      person: true
    }
  })

  return {
    person: personData?.person
  }
})