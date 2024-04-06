import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'
import { createTransactionSchema } from './createTransaction'
import db from '$lib/server/db'
import { redirect } from 'sveltekit-flash-message/server'
import { fail } from '@sveltejs/kit'
import { createTransaction } from '$lib/ongeveer/db'

export const load = (async () => {
	const form = await superValidate(createTransactionSchema)
	const users = await db.financialPerson.findMany({
		where: {
			isActive: true,
			OR: [{ type: 'USER' }, { type: 'INVICTUS' }],
		},
		select: {
			id: true,
			name: true,
		},
	})

	return { form, users }
}) satisfies PageServerLoad

export const actions = {
	default: async event => {
		const { request, locals } = event

		const form = await superValidate(request, createTransactionSchema)
		if (!form.valid) return fail(400, { form })

		const fp = await db.financialPerson.findFirst({
			where: {
				FinancialPersonDataUser: {
					userId: locals.user.id,
				},
			},
			select: { id: true },
		})

		if (!fp) {
			console.error(`Geen financiële persoon gevonden voor gebruiker #${locals.user.id} (${locals.user.firstName})`)
			return fail(500)
		}

		try {
			await createTransaction({
				giver: fp.id,
				receiver: form.data.to,
				amount: form.data.amount,
				description: form.data.description ?? '',
				isManual: true,
			})
		} catch (e) {
			console.error(e)
			return fail(500)
		}

		throw redirect(
			'/financieel/transacties',
			{
				message: 'De transactie is aangemaakt',
				type: 'success',
				title: 'Success',
			},
			event,
		)
	},
}
