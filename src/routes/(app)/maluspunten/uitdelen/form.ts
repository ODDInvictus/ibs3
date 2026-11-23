import { LDAP_IDS, Roles } from '$lib/constants'
import { Form } from '$lib/form/form-generator'
import type { Field } from '$lib/form/form-generator'
import db from '$lib/server/db'
import type { User } from '$lib/server/prisma/client'

export const maluspuntForm = new Form<{
	name: string
	reason: string
	amount: number
	user: User
}>({
	title: 'Maluspunt uitdelen',
	description: 'Met dit formulier kan je iemand een welverdiende maluspunt geven.',
	needsConfirmation: false,
	formId: 'maluspunt-form',
	submitStr: 'Opslaan',
	requiredRoles: [Roles.Members],
	logic: async data => {
        if (data.name == -1) {
            // "Alle Feuten" was selected, just handle this and dont worry about
            // other DB actions. Just find all feuten now and them all
            // [amount] maluspunten for [reason].
            const alleFeuten = await db.user.findMany({
 				where: {
 					CommitteeMember: {
 						some: {
 							committee: {
 								ldapId: LDAP_IDS.FEUTEN,
 							},
 						},
 					},
 				},
 			});
            let feutenNames = "";
            alleFeuten.forEach(async (feutje) => {
                feutenNames += " "+feutje.firstName+" "+feutje.lastName+",";
                await db.maluspunt.create({
			        data: {
				        amount: data.amount,
				        reason: data.reason,
				        receiverId: feutje.id,
				        giverId: data.user.id,
			        },
		        })
            });
            return {

                success: true,
                message: `Maluspunten zijn successvol gegeven aan ${feutenNames}`,
                status: 201,
                redirectTo: "/maluspunten",
            }
        }
		const feut = await db.user.findUnique({
			where: {
				id: Number(data.name),
			},
		})

		if (!feut) {
			return {
				success: false,
				message: 'Deze feut bestaat niet',
				status: 400,
			}
		}

		await db.maluspunt.create({
			data: {
				amount: data.amount,
				reason: data.reason,
				receiverId: feut.id,
				giverId: data.user.id,
			},
		})

		return {
			success: true,
			message: `Maluspunt is successvol gegeven aan ${feut.firstName}  `,
			status: 201,
			redirectTo: '/maluspunten',
		}
	},
	fields: [
		{
			label: 'Wie',
			name: 'name',
			type: 'select',
			getOptions: async () => {
				const feuten = await db.user.findMany({
					where: {
						CommitteeMember: {
							some: {
								committee: {
									ldapId: LDAP_IDS.FEUTEN,
								},
							},
						},
					},
				})
                if (feuten.length > 1) {
                    feuten.push({firstName: "Alle", lastName: "Feuten", id: -1}); 
                }
				return feuten.map(f => ({
					label: `${f.firstName} ${f.lastName}`,
					value: f.id,
				}))
			},
		} as Field<'select'>,
		{
			label: 'Waarom',
			name: 'reason',
			type: 'text',
			minLength: 3,
		} as Field<'text'>,
		{
			label: 'Hoeveel',
			name: 'amount',
			type: 'number',
			minValue: -1,
			maxValue: 5,
			description: 'Hoeveel maluspunten verdient deze feut?',
		} as Field<'number'>,
	],
})
