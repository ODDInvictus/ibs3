import db from '$lib/server/db'

export const load = (async () => {
  const declarations = await db.declaration.findMany({
    where: {
      accepted: false,
      denied: false,
    },
    include: {
      person: true
    }
  })

  return {
    declarations
  }
})