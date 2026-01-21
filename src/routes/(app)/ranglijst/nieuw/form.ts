import { Roles } from '$lib/constants'
import { Form } from '$lib/form/form-generator'
import type { Field } from '$lib/form/form-generator'
import { LeaderboardSort, LeaderboardTypes } from '$lib/server/prisma/client'
import db from '$lib/server/db'

export const newScoreboardForm = new Form<{
	id: string
	name: string
	description: string
	type: LeaderboardTypes
	sortBy: LeaderboardSort
	opensAt: string
	closesAt: string
}>({
	title: 'Nieuwe ranglijst aanmaken',
	description: 'Met dit formulier kan je een nieuwe ranglijst aanmaken.',
	logic: async data => {
		// Creer ranglijst
		let create = {
			id: data.id,
			name: data.name,
			description: data.description,
			type: data.type,
			sortBy: data.sortBy,
		} as Record<string, any>

		if (data.opensAt) {
			create['opensAt'] = new Date(data.opensAt)
		}

		if (data.closesAt) {
			create['closesAt'] = new Date(data.closesAt)
		}

		await db.leaderboard.create({
			// @ts-ignore
			data: {
				...create,
			},
		})

		return {
			success: true,
			message: 'Activiteit aangemaakt, je wordt nu doorgestuurd.',
			status: 201,
			redirectTo: '/ranglijst/' + data.id,
		}
	},
	extraValidators: async data => {
		const errors = []
		if (data.opensAt && data.closesAt && data.opensAt > data.closesAt) {
			errors.push({
				field: 'closesAt',
				message: 'De sluitingsdatum moet na de openingsdatum zijn.',
			})
		}
		return errors
	},
	needsConfirmation: true,
	confirmText: 'Weet je zeker dat je deze ranglijst aan wil aanmaken?',
	requiredRoles: [Roles.Senaat, Roles.Admins],
	formId: 'scoreboard-form',
	fields: [
		{
			label: 'Slug',
			name: 'id',
			minLength: 3,
			type: 'text',
			value: '',
			placeholder: 'Slug (bijv. invakancie-2024-barfcounter)',
		} as Field<'text'>,
		{
			label: 'Naam',
			name: 'name',
			minLength: 3,
			type: 'text',
			value: '',
			placeholder: 'Domme ranglijst',
		} as Field<'text'>,
		{
			label: 'Beschrijving',
			name: 'description',
			type: 'textarea',
		} as Field<'textarea'>,
		{
			label: 'Openingsdatum',
			name: 'opensAt',
			optional: true,
			type: 'date',
		} as Field<'date'>,
		{
			label: 'Sluitingsdatum',
			name: 'closesAt',
			optional: true,

			type: 'date',
		} as Field<'date'>,
		{
			label: 'Type',
			name: 'type',
			type: 'select',
			placeholder: LeaderboardTypes.COUNT,
			options: [
				{
					label: 'Aantallen',
					value: LeaderboardTypes.COUNT,
				},
				{
					label: 'Tijd',
					value: LeaderboardTypes.TIME,
				},
				{
					label: 'Highscore',
					value: LeaderboardTypes.SCORE,
				},
				{
					label: 'Adtmeister',
					value: LeaderboardTypes.ADTMEISTER,
				},
			],
		} as Field<'select'>,
		{
			label: 'Sorteren op',
			name: 'sortBy',
			type: 'select',
			description: 'Aflopend betekent dat de hoogste waarde bovenaan staat, oplopend betekent dat de laagste waarde bovenaan staat.',
			options: [
				{
					label: 'Oplopend',
					value: LeaderboardSort.ASC,
				},
				{
					label: 'Aflopend',
					value: LeaderboardSort.DESC,
				},
			],
		} as Field<'select'>,
	],
	submitStr: 'Opslaan',
})
