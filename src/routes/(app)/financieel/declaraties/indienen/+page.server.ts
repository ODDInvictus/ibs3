import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad, Actions } from './$types'
import { declatationSchema } from './declarationSchema'
import { error, fail } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import db from '$lib/server/db'
import { getLedgerIds } from '$lib/ongeveer/db'
import { uploadGenericFile } from '$lib/server/files'
import { zod4 } from 'sveltekit-superforms/adapters'

export const load = (async () => {
	return error(400, 'Declaraties worden gedaan via WBW! Vragen? Stuur een appje naar senaat')

	const data = {
		methodOfPayment: 'Eigen rekening',
		receiveMethod: 'SALDO',
	} as const
	const form = await superValidate(data, zod4(declatationSchema))
	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async event => {
		try {
			const { request, locals } = event
			const formData = await request.formData()
			const form = await superValidate(formData, zod4(declatationSchema))

			if (!form.valid) return fail(400, { form })
			const receipt = formData.get('receipt') as File
			const { receiveMethod, product, methodOfPayment, iban, price } = form.data

			const personData = await db.financialPersonDataUser.findFirst({
				where: {
					userId: locals.user.id,
				},
			})

			if (!personData) error(500, 'Gebruiker heeft geen financiële gegevens')

			await db.$transaction(async tx => {
				const description = `Declaratie: ${product}`

				let filename = null
				if (receipt && receipt?.size !== 0) {
					filename = await uploadGenericFile(receipt, locals.user)
				}

				// Create object in database
				await tx.journal.create({
					data: {
						type: 'DECLARATION',
						date: new Date(),
						termsOfPayment: 14,
						relationId: personData.personId,
						description,
						ref: description,
						Attachments: filename
							? {
									connect: {
										filename,
									},
								}
							: undefined,
						Rows: {
							create: [
								{
									amount: 1,
									price,
									ledgerId: (await getLedgerIds()).DEFAULT_DECLARATION_LEDGER,
									description: product,
								},
							],
						},
						DeclarationData: {
							create: {
								methodOfPayment,
								status: 'PENDING',
								askedAmount: price,
								receiveMethod,
								iban,
								financialPersonId: personData.personId,
								reason: product,
							},
						},
					},
				})
			})
		} catch (err: any) {
			console.error(err)
			return fail(400, { succes: false, message: err?.message ?? 'Internal Error' })
		}

		return redirect({ message: 'Je kan er gelijk nog een doen.', title: 'Declaratie ingediend', type: 'success' }, event)
	},
} satisfies Actions
