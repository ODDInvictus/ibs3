import db from '$lib/server/db'

export const load = (async ({ params }) => {
  const member = await db.user.findFirstOrThrow({
    where: {
      ldapId: params.id
    }
  })

  return {
    member
  }
})