import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ url, locals }) => {
	// Get ids from the query and get the photo objects
	// from the database

	const idsParam = url.searchParams.get('ids') as string

	const ids = idsParam.split(',').map(num => {
		return Number.parseInt(num, 10)
	})

	const photosPromise = db.photo.findMany({
		where: {
			id: {
				in: ids,
			},
		},
		include: {
			file: true,
			creator: true,
			tags: {
				select: {
					photoTag: {
						select: {
							name: true,
							id: true,
						},
					},
				},
			},
			ratings: true,
			peopleTagged: {
				select: {
					user: {
						select: {
							firstName: true,
							ldapId: true,
						},
					},
				},
			},
			activityPhotos: {
				select: {
					name: true,
					id: true,
					startTime: true,
					endTime: true,
				},
			},
		},
	})

	const tagsPromise = db.photoTag.findMany()

	const peoplePromise = db.user.findMany({
		where: {
			isActive: true,
		},
		select: {
			ldapId: true,
			firstName: true,
			id: true,
		},
		orderBy: {
			firstName: 'asc',
		},
	})

	const activitiesPromise = db.activity.findMany({
		select: {
			id: true,
			name: true,
			endTime: true,
			startTime: true,
		},
		orderBy: {
			endTime: 'desc',
		},
	})

	const [photos, tags, people, activities] = await Promise.all([photosPromise, tagsPromise, peoplePromise, activitiesPromise])

	return { photos, tags, people, activities }
}) satisfies PageServerLoad
