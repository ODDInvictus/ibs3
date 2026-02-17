import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ params }) => {
	if (!params.name) return {}

	const name = params.name

	if (name.startsWith('tag')) {
		const tag = await db.photoTag.findFirst({
			where: {
				id: Number(name.split('/')[1]),
			},
		})

		if (!tag) return {}

		const photos = (
			await db.photosWithTags.findMany({
				where: {
					photoTagId: tag.id,
				},
				select: {
					photo: {
						include: {
							file: {
								select: {
									filename: true,
								},
							},
						},
					},
				},
				orderBy: {
					photo: {
						createdAt: 'desc',
					},
				},
			})
		).map(({ photo }) => photo)

		return {
			type: 'tag',
			title: tag.name,
			photos,
		}
	} else if (name.startsWith('alles')) {
		const photos = await db.photo.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				visible: true,
			},
			include: {
				file: {
					select: {
						filename: true,
					},
				},
			},
		})

		return {
			type: 'all',
			title: 'Alle Fotos',
			photos,
		}
	} else if (name.startsWith('geen-tags')) {
		// Select all photos that have no tags, or linked activity
		const photos = await db.photo.findMany({
			where: {
				AND: [
					{
						tags: {
							none: {},
						},
					},
					{
						activityPhotoId: null,
					},
					{
						visible: true,
					},
				],
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				file: {
					select: {
						filename: true,
					},
				},
			},
		})

		return {
			type: 'no-tags',
			title: "Ongetagde foto's",
			photos,
		}
	}
	// We now can asssume it's an activity

	const aid = name.split('/')[1]

	if (!aid) return {}

	const activity = await db.activity.findFirst({
		where: {
			id: Number(aid),
		},
		include: {
			photos: {
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					file: {
						select: {
							filename: true,
						},
					},
				},
			},
		},
	})

	if (!activity) return {}

	return {
		type: 'activity',
		title: activity.name,
		activity,
	}
}) satisfies PageServerLoad
