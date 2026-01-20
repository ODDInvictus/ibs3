import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings/settings.js'
import { env } from '$env/dynamic/private'

export const load = async ({ locals, params }) => {
	const user = locals.user
	const committees = locals.committees

	const EMAIL_DOMAIN = settings.getOrSkError(Setting.EMAIL_DOMAIN)

	let aliases = [`${user.firstName} ${user.lastName} <${user.email}>`]

	const committeeAliases = await db.emailAliasCommittee.findMany({
		where: {
			committeeId: {
				in: committees.map(committee => committee.id),
			},
		},
		include: {
			alias: true,
			committee: true,
		},
	})

	const userAliases = await db.emailAliasUser.findMany({
		where: {
			userId: user.id,
		},
		include: {
			alias: true,
		},
	})

	aliases = aliases.concat(committeeAliases.map(alias => `${alias.committee.name} <${alias.alias.alias}@${EMAIL_DOMAIN}>`))
	aliases = aliases.concat(userAliases.map(alias => `${user.firstName} ${user.lastName} <${alias.alias.alias}@${EMAIL_DOMAIN}>`))

	// get [id] from path
	const id = params.id

	return {
		aliases,
		to: `${id}@${EMAIL_DOMAIN}`,
	}
}

export const actions = {
	default: async ({ request, params, locals }) => {
		const data = await request.formData()
		const body = Object.fromEntries(data)
		const toAlias = params.id
		const senderAlias = (body.sender as string).split('<')[1].split('@')[0]

		const EMAIL_DOMAIN = settings.getOrSkError(Setting.EMAIL_DOMAIN)

		if (!body.subject || !body.message || !body.toName) {
			return {
				status: 400,
				success: false,
				message: 'Onderwerp, bericht, en Naam ontvanger(s) zijn verplicht',
			}
		}

		let senderValid = false
		let receiverValid = false

		// Now check if sender and receiver are valid
		const sender = await db.emailAlias.findFirst({
			where: {
				alias: senderAlias,
			},
		})

		if (sender) {
			senderValid = true
		} else {
			const user = await db.user.findFirst({
				where: {
					ldapId: senderAlias,
				},
			})

			if (user) {
				senderValid = true
			}
		}

		const receiver = await db.emailAlias.findFirst({
			where: {
				alias: toAlias,
			},
		})

		if (receiver) {
			receiverValid = true
		} else {
			const user = await db.user.findFirst({
				where: {
					ldapId: toAlias,
				},
			})

			if (user) {
				receiverValid = true
			}
		}

		if (!senderValid || !receiverValid) {
			return {
				status: 400,
				success: false,
				message: 'Verstuurder of ontvanger ongeldig',
			}
		}

		return await fetch(`${env.BACKEND_URL}/email/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				subject: body.subject,
				from: body.sender,
				to: `${body.toName} <${toAlias}@${EMAIL_DOMAIN}>`,
				toName: body.toName,
				text: body.message,
				fromName: (body.sender as string).split('<')[0].trim(),
				senderFirstName: locals.user.firstName,
			}),
		})
			.then(() => {
				return {
					success: true,
					status: 200,
				}
			})
			.catch(err => {
				console.error(err)
				return {
					success: false,
					status: 500,
					message: err.message,
				}
			})
	},
}
