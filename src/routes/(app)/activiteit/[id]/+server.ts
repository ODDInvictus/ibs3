import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { activitySlug } from '$lib/textUtils'
import { error, redirect } from '@sveltejs/kit'

type RequestType = {
	status: boolean
	activityId: number
}

// rewrite the url to /activiteit/[slug]/id
export const GET: RequestHandler = async ({ request, params }) => {
	const id = params.id

	// Get activity
	const activity = await db.activity.findUnique({
		where: {
			id: Number(id),
		},
	})

	if (!activity) {
		return new Response('Activity not found', {
			status: 404,
		})
	}

	const slug = activitySlug(activity.name)

	redirect(301, `/activiteit/${slug}/${id}`)
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { status, activityId }: RequestType = await request.json()
	const user = locals.user

	const activity = await db.activity.findUnique({
		where: {
			id: activityId,
		},
		select: {
			endTime: true,
		},
	})

	if (!activity) {
		return error(404, 'Activiteit niet gevonden')
	}

	if (activity.endTime < new Date()) {
		return error(400, 'Activiteit is al geweest, je kan je status niet meer aanpassen')
	}

	await db.attending.updateMany({
		where: {
			userId: user.id,
			activityId,
		},
		data: {
			isAttending: status,
		},
	})

	return new Response('', {
		status: 200,
	})
}
