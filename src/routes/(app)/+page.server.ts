import db from '$lib/server/db'

export const load = (async () => {
  const dayInt = new Date().getDay()

  const query = await db.$queryRaw`
    SELECT firstName, picture FROM User
    ORDER BY RAND(${dayInt})
    LIMIT 1;
  `

  const member = query[0]

  return {
    member
  }
})