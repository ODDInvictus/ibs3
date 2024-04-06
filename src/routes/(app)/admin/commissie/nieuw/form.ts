import { Roles } from '$lib/constants'
import { Form } from '$lib/form/form-generator'
import type { Field } from '$lib/form/form-generator'
import db from '$lib/server/db'

export const newCommitteeForm = new Form<{
	name: string
	ldapId: string
}>({
	title: 'Nieuwe commissie aanmaken',
	description: 'Met dit formulier kan je een nieuwe commissie aanmaken.',
	needsConfirmation: true,
	confirmText: 'Weet je zeker dat je deze commissie wilt aanmaken?',
	formId: 'new-committee-form',
	submitStr: 'Opslaan',
	requiredRoles: [Roles.Senaat, Roles.Admins],
	logic: async data => {
		const ldapId = data.ldapId.toLowerCase()

		await db.committee.create({
			data: {
				name: data.name,
				ldapId,
			},
		})

		return {
			success: true,
			message: 'Commissie aangemaakt, je wordt nu doorgestuurd om leden toe te voegen.',
			status: 201,
			redirectTo: '/admin/commissie',
		}
	},
	extraValidators: async data => {
		const errors = []

		if (data.ldapId.includes(' '))
			errors.push({
				field: 'ldapId',
				message: 'De ldap ID mag geen spaties bevatten.',
			})

		// Now check if the ldap ID already exists
		const res = await db.committee.findMany({
			where: {
				ldapId: data.ldapId,
			},
		})

		if (res.length > 0)
			errors.push({
				field: 'ldapId',
				message: 'Deze ldap ID bestaat al.',
			})

		return errors
	},
	fields: [
		{
			label: 'Naam',
			name: 'name',
			minLength: 1,
			type: 'text',
			placeholder: 'Commissie naam',
		} as Field<'text'>,
		{
			label: 'LdapID',
			name: 'ldapId',
			type: 'text',
			minLength: 1,
			description: 'De interne ID van de commissie, wordt bijvoorbeeld gebruikt voor de mailadressen. Kan geen spaties bevatten.',
		} as Field<'text'>,
	],
})
