import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

const getLeaderboard = async () => {
	const q = (await db.$queryRaw`
    SELECT u.firstName, u.nickName, u.id, SUM(c.amount) AS amount
    FROM User AS u, ClickSession AS c
    WHERE u.id = c.userId
    GROUP BY c.userId
    ORDER BY amount DESC
  `) as { firstName: string; nickName: string; id: number; amount: number }[]
	return q.map(e => {
		return { ...e, amount: Number(e.amount) }
	})
}

const getPlaytime = async () => {
	const q = (await db.$queryRaw`
    SELECT diff.userId, SUM(diff.t) AS 'time'
    FROM (
      SELECT userId, TIMESTAMPDIFF(MINUTE, startTime, endTime) AS t
      FROM ClickSession
    ) AS diff
    GROUP BY diff.userId;
  `) as { userId: number; time: number }[]
	const c: { [key: number]: number } = {}
	q.forEach(e => {
		c[e.userId] = Number(e.time)
	})
	return c
}

const getLastUpdates = async () => {
	const q = (await db.$queryRaw`
    SELECT x.userId, SUM(x.amount) AS amount
    FROM (
      SELECT c.userId, c.amount
      FROM ClickSession AS c
      ORDER BY c.id DESC
      LIMIT 3
    ) AS x
    GROUP BY x.userId
  `) as { userId: number; amount: number }[]
	const c: { [key: number]: number } = {}
	q.forEach(e => {
		c[e.userId] = Number(e.amount)
	})
	return c
}

export const load = (() => {
	return {
		leaderboard: getLeaderboard(),
		playTime: getPlaytime(),
		lastUpdates: getLastUpdates(),
	}
}) satisfies PageServerLoad
