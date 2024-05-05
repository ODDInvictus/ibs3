import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load = (async ({ url, locals }) => {
	// Get ids from the query and get the photo objects
	// from the database

	const idsParam = url.searchParams.get('ids') as string

	const ids = idsParam.split(',').map(id => parseInt(id))

	const photosPromise = db.photo.findMany({
		where: {
			id: {
				in: ids,
			},
		},
		include: {
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
			activityImage: {
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

	const photoCreatorsPromise = db.photoCreator.findMany()

	const peoplePromise = db.user.findMany({
		where: {
			isActive: true,
		},
		select: {
			ldapId: true,
			firstName: true,
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

	const [photos, photoCreators, tags, people, activities] = await Promise.all([
		photosPromise,
		photoCreatorsPromise,
		tagsPromise,
		peoplePromise,
		activitiesPromise,
	])

	return { photos, photoCreators, tags, people, activities }
}) satisfies PageServerLoad
