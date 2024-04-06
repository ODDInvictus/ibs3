import db from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const alias = await db.emailAlias.findUnique({
		where: {
			id: Number(params.id),
		},
		include: {
			EmailAliasCommittee: {
				include: {
					committee: {
						include: {
							CommitteeMember: {
								include: {
									member: true,
								},
							},
						},
					},
				},
			},
			EmailAliasUser: {
				include: {
					user: true,
				},
			},
			EmailContact: true,
		},
	})

	if (!alias) throw error(404, 'Alias niet gevonden')

	let type = ''
	let users: { id: number; firstName: string; lastName: string; email: string }[] = []

	if (alias.EmailAliasCommittee.length > 0) {
		type = 'committee'
	} else if (alias.EmailAliasUser.length > 0) {
		type = 'user'
		users = await db.user.findMany({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
			},
		})
	} else {
		type = 'custom'
	}

	return {
		domain: process.env.EMAIL_DOMAIN,
		alias,
		type,
		users,
	}
}) satisfies PageServerLoad
