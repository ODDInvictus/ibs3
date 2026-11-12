import { fail, redirect } from '@sveltejs/kit'
import { isSenaat } from '$lib/server/auth/helpers'
import db from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const now = new Date()
	const canChooseAnyCommittee = isSenaat(locals.user)
	const [users, committees] = await Promise.all([
		db.user.findMany({
			where: { isActive: true },
			select: { id: true, firstName: true, lastName: true, nickname: true },
			orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		}),
		db.committee.findMany({
			where: {
				isActive: true,
				...(!canChooseAnyCommittee && {
					CommitteeMember: {
						some: {
							userId: locals.user.id,
							joinDate: { lte: now },
							leaveDate: null,
						},
					},
				}),
			},
			select: {
				id: true,
				name: true,
				CommitteeMember: {
					where: {
						joinDate: { lte: now },
						leaveDate: null,
						member: { isActive: true },
					},
					select: {
						member: { select: { id: true, firstName: true, lastName: true, nickname: true } },
					},
				},
			},
			orderBy: { name: 'asc' },
		}),
	])

	return { users, committees }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const title = String(formData.get('title') ?? '').trim()
		const description = String(formData.get('description') ?? '').trim()
		const location = String(formData.get('location') ?? '').trim()
		const targetType = formData.get('targetType')
		const targetIdValues = formData.getAll('targetId').map(value => String(value))
		const targetIds = targetIdValues.map(Number)
		const startTimeValue = String(formData.get('startTime') ?? '')
		const endTimeValue = String(formData.get('endTime') ?? '')
		const startTime = new Date(startTimeValue)
		const endTime = new Date(endTimeValue)
		const values = {
			title,
			description,
			location,
			targetType: String(targetType ?? ''),
			targetIds: targetIdValues,
			startTime: startTimeValue,
			endTime: endTimeValue,
		}
		const failWithValues = (error: string) => fail(400, { error, values })

		if (!title) return failWithValues('Vul een titel in.')
		if (targetType !== 'user' && targetType !== 'committee') return failWithValues('Kies een gebruiker of commissie.')
		if (targetIds.length === 0 || targetIds.some(id => !Number.isInteger(id) || id <= 0)) {
			return failWithValues('Kies een geldige gebruiker of commissie.')
		}
		if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) {
			return failWithValues('Vul een geldige begin- en eindtijd in; de eindtijd moet na de begintijd liggen.')
		}
		if (!location) return failWithValues('Vul een locatie in')

		const now = new Date()
		const canChooseAnyCommittee = isSenaat(locals.user)
		const created = await db.$transaction(async tx => {
			let userIds: number[]

			if (targetType === 'user') {
				const selectedIds = [...new Set(targetIds)]
				const users = await tx.user.findMany({
					where: { id: { in: selectedIds }, isActive: true },
					select: { id: true },
				})
				if (users.length !== selectedIds.length) return false
				userIds = users.map(user => user.id)
			} else {
				if (targetIds.length !== 1) return false
				const committee = await tx.committee.findFirst({
					where: {
						id: targetIds[0],
						isActive: true,
						...(!canChooseAnyCommittee && {
							CommitteeMember: {
								some: {
									userId: locals.user.id,
									joinDate: { lte: now },
									leaveDate: null,
								},
							},
						}),
					},
					select: {
						CommitteeMember: {
							where: {
								joinDate: { lte: now },
								leaveDate: null,
								member: { isActive: true },
							},
							select: { userId: true },
						},
					},
				})
				if (!committee || committee.CommitteeMember.length === 0) return false
				userIds = committee.CommitteeMember.map(member => member.userId)
			}

			await tx.calendarEvent.create({
				data: {
					title,
					description,
					location: location || null,
					startTime,
					endTime,
					createdById: locals.user.id,
					calendarEventUsers: {
						create: userIds.map(userId => ({ user: { connect: { id: userId } } })),
					},
				},
			})
			return true
		})

		if (!created)
			return failWithValues('De geselecteerde gebruiker of commissie is niet beschikbaar, of de commissie heeft geen actieve leden.')
		throw redirect(303, '/kalender')
	},
} satisfies Actions
