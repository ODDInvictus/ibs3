import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import type { Photo } from '$lib/server/prisma/client'

type PhotoHighlight = {
	firstName: string
	filename: string
	pid: number
}

export const load = (async () => {
	const rand = Date.now()

	const getHighlight = async () => {
		const query: Photo[] = await db.$queryRaw`
      SELECT Photo.id as pid, User.firstName, File.filename, visible FROM Photo
      LEFT JOIN User ON User.id = Photo.creatorId
			LEFT JOIN File on File.id = Photo.fileId
      WHERE Photo.visible = 1
      ORDER BY RAND(${rand})
      LIMIT 1;
    `

		return query[0] as unknown as PhotoHighlight
	}

	const activities = (
		await db.activity.findMany({
			select: {
				id: true,
				name: true,
				_count: {
					select: {
						photos: true,
					},
				},
			},
			orderBy: {
				startTime: 'desc',
			},
		})
	)
		.filter(a => a._count.photos > 0)
		.slice(0, 5)

	return {
		highlight: await getHighlight(),
		activities,
	}
}) satisfies PageServerLoad
