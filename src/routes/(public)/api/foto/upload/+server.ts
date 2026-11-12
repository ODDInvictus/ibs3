import { verifyTokenWithoutUser } from '$lib/server/auth'
import { uploadGenericFile } from '$lib/server/files'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, params }) => {
	// eerst body
	const body = await request.json()

	// check of token geldig is
	if (!body.token) {
		return fail(400, 'Geen token meegegeven')
	}

	const { valid, user } = await verifyTokenWithoutUser(body.token, 'api-photo-upload')

	if (!valid) {
		return fail(403, 'Token ongeldig')
	}

	// upload foto
	delete body.photo

	console.log(body)

	// uploadGenericFile()

	// set geuploade foto als original (en misschien normal)

	// maak thumbnail

	return new Response()
}

const fail = (code: number, message: string) => {
	return new Response(message, { status: code })
}
