import { authAdmin } from '$lib/server/authorizationMiddleware'
import { error, type RequestHandler } from '@sveltejs/kit'
import db from '$lib/server/db'

export const DELETE = (async ({ request, locals }) => {
	const [authorized, committees] = authAdmin(locals)
	if (!authorized)
		return new Response('Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '), {
			status: 403,
		})

	const body = await request.json()

	if (!body.type) {
		return new Response(JSON.stringify({ message: 'Type is verplicht' }), { status: 400 })
	}

	if (body.type === 'member') {
		if (body.id) {
			// First check if the CommitteeMember exists
			const committeeMember = await db.committeeMember.findUnique({
				where: {
					id: body.id,
				},
			})

			if (committeeMember) {
				// Then delete the CommitteeMember
				return await db.committeeMember
					.delete({
						where: {
							id: body.id,
						},
					})
					.then(() => new Response(JSON.stringify({ message: 'Verwijderen gelukt!' }), { status: 200 }))
					.catch(err => {
						console.error('[Admin/Commissie]', err)
						return new Response(JSON.stringify({ message: 'Verwijderen mislukt' }), {
							status: 500,
						})
					})
			}
		}

		return new Response(JSON.stringify({ message: 'Commissielid niet gevonden' }), { status: 404 })
	} else if (body.type === 'committee') {
		if (body.id) {
			// Delete the committee
			return await db
				.$transaction(async tx => {
					// First delete the EmailAliases
					const alias = await tx.emailAliasCommittee.findFirst({
						where: {
							committeeId: body.id,
						},
					})

					if (alias) {
						await tx.emailAlias.delete({
							where: {
								id: alias.emailAliasId,
							},
						})
					}

					// Then delete the CommitteeMembers
					await tx.committeeMember.deleteMany({
						where: {
							committeeId: body.id,
						},
					})

					// Then "delete" the Committee
					await tx.committee.update({
						where: {
							id: body.id,
						},
						data: {
							isActive: false,
						},
					})
				})
				.then(
					() =>
						new Response(JSON.stringify({ message: 'Commissie succesvol verwijderd' }), {
							status: 200,
						}),
				)
				.catch(err => {
					console.error('[Admin/Commissie]', err)
					return new Response(JSON.stringify({ message: 'Iets ging fout aan onze kant. Probeer het later opnieuw' }), { status: 500 })
				})
		}
		return new Response(JSON.stringify({ message: 'Commissie ID is verplicht' }), { status: 404 })
	} else {
		return new Response(JSON.stringify({ message: 'Type niet gevonden' }), { status: 404 })
	}
}) satisfies RequestHandler

export const POST = (async ({ request, locals }) => {
	const [authorized, committees] = authAdmin(locals)
	if (!authorized)
		throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

	const body = await request.json()

	if (body.id && body.userId) {
		// Create a new CommitteeMember
		try {
			// First check if the CommitteeMember already exists
			const committeeMember = await db.committeeMember.findFirst({
				where: {
					committeeId: body.id,
					userId: body.userId,
				},
			})

			if (!committeeMember) {
				await db.committeeMember.create({
					data: {
						committeeId: body.id,
						userId: body.userId,
					},
				})

				return new Response(JSON.stringify({ message: 'Toevoegen gelukt!' }), { status: 200 })
			}

			return new Response(JSON.stringify({ message: 'Dit lid zit al in deze commissie' }), {
				status: 409,
			})
		} catch (err) {
			console.error('[Admin/Commissie]', err)
			return new Response(JSON.stringify({ message: 'Toevoegen mislukt' }), { status: 500 })
		}
	}

	return new Response(JSON.stringify({ message: 'Commissie of gebruiker niet gevonden' }), {
		status: 404,
	})
}) satisfies RequestHandler

export const PUT = (async ({ request, locals }) => {
	const [authorized, committees] = authAdmin(locals)
	if (!authorized)
		throw error(403, 'Helaas heb jij geen toegang tot deze actie. Je mist een van de volgende rollen: ' + committees.join(', '))

	const body = await request.json()

	// Rename committee

	if (body.id && body.newName) {
		// Create a new CommitteeMember
		try {
			await db.committee.update({
				where: {
					id: body.id,
				},
				data: {
					name: body.newName,
				},
			})

			return new Response(JSON.stringify({ message: 'Naam bewerken gelukt' }), { status: 200 })
		} catch (err) {
			console.error('[Admin/Commissie]', err)
			return new Response(JSON.stringify({ message: 'Naam bewerken mislukt' }), { status: 500 })
		}
	}

	return new Response(JSON.stringify({ message: 'Commissie niet gevonden' }), { status: 404 })
}) satisfies RequestHandler
