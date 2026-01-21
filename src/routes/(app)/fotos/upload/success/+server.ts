import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import type { User } from '$lib/server/prisma/client'

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json()

	switch (body.type) {
		case 'new_tag':
			return await newTag(body)
		case 'remove_tag':
			return await removeTag(body)
		case 'save_change':
			return await saveChange(body, locals.user)
		case 'multiple_activities':
			return await multipleActivities(body)
		default:
			return err(400, 'Request type is niet geldig')
	}
}

function success(data: any, msg: string) {
	return new Response(
		JSON.stringify({
			status: 200,
			message: msg,
			data,
			success: true,
		}),
	)
}

function err(status: number, msg: string) {
	return new Response(
		JSON.stringify({
			message: msg,
			status,
			success: false,
		}),
	)
}

type NewTagBodyType = {
	type: 'new_tag'
	tag: string
}

async function newTag(body: NewTagBodyType) {
	if (!body.tag) return err(400, 'Geen tag opgegeven')

	const tag = await db.photoTag.upsert({
		where: {
			name: body.tag,
		},
		create: {
			name: body.tag,
		},
		update: {},
	})

	return success(tag, 'Tag created')
}

type RemoveTagBodyType = {
	type: 'remove_tag'
	photo: number
	tag: number
}

async function removeTag(body: RemoveTagBodyType) {
	if (!body.photo) return err(400, 'Geen foto opgegeven')
	if (!body.tag) return err(400, 'Geen tag opgegeven')

	await db.photosWithTags.delete({
		where: {
			photoId_photoTagId: {
				photoId: body.photo,
				photoTagId: body.tag,
			},
		},
	})

	return success({}, 'Tag verwijderd')
}

type SaveChangeBodyType = {
	type: 'save_change'
	photo: number
	field: string
	value: string
}

async function saveChange(body: SaveChangeBodyType, user: User) {
	// First we check if the body is valid
	if (!body.photo) return err(400, 'Geen foto opgegeven')
	if (!body.field) return err(400, 'Geen veld opgegeven')
	if (!body.value) return err(400, 'Geen waarde opgegeven')

	// Then we fetch the photo
	const photo = await db.photo.findUnique({
		where: {
			id: body.photo,
		},
	})

	if (!photo) return err(404, 'Foto niet gevonden')

	switch (body.field) {
		case 'name':
			const creator = await db.user.findFirst({
				where: {
					id: parseInt(body.value),
				},
			})

			if (!creator) return err(404, 'Fotomaker niet gevonden')

			await db.photo.update({
				where: {
					id: body.photo,
				},
				data: {
					creatorId: creator.id,
				},
			})
			return success({}, 'Wijziging opgeslagen')
		case 'date':
			// First check if it is a valid date
			const date = new Date(body.value)
			if (isNaN(date.getTime())) return err(400, 'Geen geldige datum')

			await db.photo.update({
				where: {
					id: body.photo,
				},
				data: {
					date: date,
				},
			})

			return success({}, 'Wijziging opgeslagen')
		case 'description':
			// Check if it is a string with more than 1 character
			if (typeof body.value !== 'string') return err(400, 'Geen geldige beschrijving')

			await db.photo.update({
				where: {
					id: body.photo,
				},
				data: {
					description: body.value,
				},
			})

			return success({}, 'Wijziging opgeslagen')

		case 'tags':
			// Fetch the tag from the database
			const tag = await db.photoTag.findFirst({
				where: {
					id: parseInt(body.value),
				},
			})

			if (!tag) return err(404, 'Tag niet gevonden')

			// Check if the photo already has the tag
			const photoTag = await db.photosWithTags.findFirst({
				where: {
					photoId: body.photo,
					photoTagId: tag.id,
				},
			})

			if (photoTag) return err(400, 'Foto heeft deze tag al')

			// Add the tag to the photo
			await db.photosWithTags.create({
				data: {
					photoId: body.photo,
					photoTagId: tag.id,
					assignedById: user.id,
				},
			})

			return success({}, 'Tag toegevoegd')

		case 'people':
			// 'value' is an array of people ldapId's
			// Check if it is an array
			if (!Array.isArray(body.value)) return err(400, 'Geen geldige personen')

			// Fetch all users
			const users = await db.user.findMany({
				where: {
					ldapId: {
						in: body.value as unknown as string[],
					},
				},
			})

			if (users.length === 0 || users.length !== body.value.length) {
				// If no users are found, return an error
				return err(404, 'Geen personen gevonden')
			}

			const input = users.map(user => ({
				photoId: body.photo,
				userId: user.id,
			}))

			// Now we have all the users, we can add them to the photo
			await db.photoPersonTag.createMany({
				data: input,
			})

			return success({}, 'Wijziging opgeslagen')
		case 'activity':
			// Fetch the activity from the database
			const activity = await db.activity.findFirst({
				where: {
					id: parseInt(body.value),
				},
			})

			if (!activity) return err(404, 'Activiteit niet gevonden')

			// Now update the `activity` and `date` field on photo
			await db.photo.update({
				where: {
					id: body.photo,
				},
				data: {
					activityPhotoId: activity.id,
					date: activity.startTime,
				},
			})

			return success({}, 'Wijziging opgeslagen')
		default:
			return err(400, 'Veld niet gevonden')
	}
}

type MultipleActivitiesBodyType = {
	type: 'multiple_activities'
	photos: number
	value: number
}

async function multipleActivities(body: MultipleActivitiesBodyType) {
	// Check if body.photos is an array
	if (!Array.isArray(body.photos)) return err(400, 'Geen geldige activiteiten')

	const photos = await db.photo.findMany({
		where: {
			id: {
				in: body.photos,
			},
		},
	})

	if (photos.length === 0 || photos.length !== body.photos.length) {
		return err(404, `Geen foto's gevonden`)
	}

	// Fetch the activity from the database
	const activity = await db.activity.findFirst({
		where: {
			id: body.value,
		},
	})

	if (!activity) return err(404, 'Activiteit niet gevonden')

	// Now update the `activity` and `date` field on photo
	await db.photo.updateMany({
		where: {
			id: {
				in: body.photos,
			},
		},
		data: {
			activityPhotoId: activity.id,
		},
	})

	return success({}, 'Wijziging opgeslagen')
}
