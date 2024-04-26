import { redirect } from '@sveltejs/kit'
import db from '$lib/server/db'

export async function GET({ params, locals }) {
	const { key } = params

	// Find the link
	const link = await db.link.findFirst({
		where: {
			shortLink: key,
		},
	})

	if (!link) {
		redirect(302, '/s/error')
	}

	// We have to check locals.user here, since it CAN be null here.
	// This is because this route is situated outside of /(app), thus circumventing the auth middleware.
	if (locals.user) {
		// Now create a link click
		await db.linkClick.create({
			data: {
				linkId: link.id,
				userId: locals.user.id,
			},
		})
	}

	// Redirect the user
	redirect(302, link.link)
}
