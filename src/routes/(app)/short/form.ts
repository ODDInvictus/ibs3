import { env } from '$env/dynamic/private'
import { Roles } from '$lib/constants'
import { Form } from '$lib/form/form-generator'
import type { Field } from '$lib/form/form-generator'
import db from '$lib/server/db'

export const shortLinkForm = new Form<{
	link: string
	slug: string
}>({
	title: 'Maak een kortere link aan!',
	shortTitle: 'Link shortner',
	description: 'Maak een kortere link aan voor een link die je vaak gebruikt. Bijvoorbeeld een YouTube video of een website.',
	logic: async data => {
		let { slug } = data
		const { link } = data

		if (!slug) {
			// Generate an unique slug
			slug = Math.random().toString(36).substring(2, 7)
		}

		await db.link.create({
			data: {
				link,
				shortLink: slug,
				userId: data.user.id,
			},
		})

		return {
			success: true,
			message: 'Shortlink aangemaakt, je wordt nu doorgestuurd.',
			status: 201,
			redirectTo: '/short/success?slug=' + slug,
		}
	},
	extraValidators: async data => {
		const errors = []

		const existing = await db.link.findFirst({
			where: {
				shortLink: data.slug,
			},
		})

		if (existing) {
			errors.push({
				field: 'slug',
				message: 'Er bestaat al een link met die verkorting, probeer iets anders.',
			})
		}

		return errors
	},
	needsConfirmation: false,
	requiredRoles: [Roles.Members],
	formId: 'shortlink-form',
	fields: [
		{
			label: 'Link',
			name: 'link',
			minLength: 3,
			type: 'url',
			placeholder: 'https://www.youtube.com/watch?v=KEl5Gi9l528',
		} as Field<'url'>,
		{
			label: 'Verkorting',
			name: 'slug',
			optional: true,
			type: 'text',
			placeholder: 'Er wordt een verkorting gegenereerd als je niks kiest.',
			description: `De verkorting van je link, denk aan ${env.IBS_URL}/s/alv-4 waar alv-4 dan de verkorting is.`,
		} as Field<'text'>,
	],
	submitStr: 'Verkorten',
})
