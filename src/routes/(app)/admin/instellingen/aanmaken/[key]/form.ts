import { Roles } from '$lib/constants'
import { Form } from '$lib/form/form-generator'
import type { Field } from '$lib/form/form-generator'
import { LeaderboardSort, LeaderboardTypes } from '@prisma/client'
import db from '$lib/server/db'
import { Setting, settings } from '$lib/server/settings'

export const newSettingForm = new Form<{
	name: string
	description: string
	value: string
}>({
	title: 'Setting aanmaken',
	description: 'Maak een instelling aan in de database.',
	logic: async data => {
		await db.settings.create({
			data: {
				name: data.name,
				description: data.description,
				value: data.value,
			},
		})

		console.log(`[SETTINGS] Created setting ${data.name} with value ${data.value}`)

		await settings.invalidate()

		return {
			success: true,
			message: 'Instelling aangemaakt, je wordt nu doorgestuurd.',
			status: 201,
			redirectTo: '/admin/instellingen',
		}
	},
	extraValidators: async data => {
		const errors = []

		// @ts-expect-error Ja klopt
		if (settings.keys[data.name]) {
			errors.push({
				field: 'id',
				message: 'Deze instelling bestaat al.',
			})
		}

		// Check if the setting name is a valid identifier
		if (!Object.values(Setting).includes(data.name as any)) {
			errors.push({
				field: 'name',
				message: 'Deze instelling bestaat niet.',
			})
		}

		return errors
	},
	needsConfirmation: true,
	confirmText: 'Weet je zeker dat je deze instelling aan wil aanmaken?',
	requiredRoles: [Roles.Admins],
	formId: 'new-settings-form',
	fields: [
		{
			label: 'Naam',
			name: 'name',
			minLength: 3,
			type: 'text',
			value: '',
			placeholder: 'Naam van de instelling',
		} as Field<'text'>,
		{
			label: 'Beschrijving',
			name: 'description',
			minLength: 3,
			type: 'text',
			value: '',
			placeholder: 'Wat doet deze instelling?',
		} as Field<'text'>,
		{
			label: 'Waarde',
			name: 'value',
			type: 'text',
		} as Field<'text'>,
	],
	submitStr: 'Opslaan',
})
