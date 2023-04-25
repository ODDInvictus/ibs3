import db from '$lib/server/db'

export const load = (async ({ params }) => {
  const committee = await db.committee.findFirstOrThrow({
    where: {
      ldapId: params.id
    },
    include: {
      CommitteeMember: {
        include: {
          member: true
        }
      }
    }
  })

  return {
    committee
  }
})