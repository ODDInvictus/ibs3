import type { RequestHandler } from './$types'
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const body = await request.json()

	const pid = Number(params.id)
	const uid = locals.user.id

	switch (body.type) {
		case 'rating':
			return await rate(body, pid, uid)
		case 'tag':
			return await tag(body, pid, uid)
		case 'remove-tag':
			return await removeTag(body, pid)
		default:
			return err(400, 'Request type onbekend')
	}
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

function success(msg: string, data: any = null) {
	return new Response(
		JSON.stringify({
			status: 200,
			message: msg,
			success: true,
			data,
		}),
	)
}

type RatingBodyType = {
	type: 'rating'
	rating: number
}

async function rate(body: RatingBodyType, pid: number, uid: number) {
	if (!body.rating || body.rating < 1 || body.rating > 5) {
		return err(400, 'Rating moet tussen 1 en 5 zijn')
	}

	const rating = body.rating

	await db.photoRating.upsert({
		where: {
			photoId_userId: {
				photoId: pid,
				userId: uid,
			},
		},
		create: {
			photoId: pid,
			userId: uid,
			rating: rating,
		},
		update: {
			rating: rating,
		},
	})

	// Now calculate the average rating
	const avgRating = await db.photoRating.aggregate({
		where: {
			photoId: pid,
		},
		_avg: {
			rating: true,
		},
	})

	return success('Rating opgeslagen', avgRating._avg.rating)
}

type TagBodyType = {
	type: 'tag'
	tag: string
}

async function tag(body: TagBodyType, pid: number, uid: number) {
	const tid = Number(body.tag)

	if (!body.tag || isNaN(tid)) {
		return err(400, 'tag is niet geldig')
	}

	// Now create a photowithtags object
	const t = await db.photosWithTags.create({
		data: {
			photoId: pid,
			photoTagId: tid,
			assignedById: uid,
		},
		select: {
			photoTag: true,
		},
	})

	return success('Tag opgeslagen', t)
}

type RemoveTagBodyType = {
	type: 'remove-tag'
	tag: string
}

async function removeTag(body: RemoveTagBodyType, pid: number) {
	const tid = Number(body.tag)

	if (!body.tag || isNaN(tid)) {
		return err(400, 'tag is niet geldig')
	}

	// Remove the photosWithTags objecty
	await db.photosWithTags.delete({
		where: {
			photoId_photoTagId: {
				photoId: pid,
				photoTagId: tid,
			},
		},
	})

	const tag = await db.photoTag.findUnique({
		where: {
			id: tid,
		},
	})

	return success('Tag verwijderd', tag)
}
