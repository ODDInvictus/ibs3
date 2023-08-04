import { LDAP_IDS, Roles } from '$lib/constants';
import { Form } from '$lib/form/form-generator';
import type { Field } from '$lib/form/form-generator';
import db from '$lib/server/db'

export const maluspuntForm = new Form<{
  name: string
  ldapId: string
}>({
  title: 'Maluspunt uitdelen',
  description: 'Met dit formulier kan je iemand een welverdiende maluspunt geven.',
  needsConfirmation: false,
  formId: 'maluspunt-form',
  submitStr: 'Opslaan',
  requiredRoles: [Roles.Members],
  logic: async (data) => {
    console.log(data)

    return {
      success: true,
      message: 'Commissie aangemaakt, je wordt nu doorgestuurd om leden toe te voegen.',
      status: 201,
      redirectTo: '/admin/commissie'
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
                  ldapId: LDAP_IDS.FEUTEN
                }
              }
            }
          }
        })

        return feuten.map(f => ({
          label: `${f.firstName} ${f.lastName}`,
          value: f.id
        }))
      },
      description: 'Welke feut is het nu weer?',
    } as Field<'select'>,
    {
      label: 'LdapID',
      name: 'ldapId',
      type: 'text',
      minLength: 1,
      description: 'De interne ID van de commissie, wordt bijvoorbeeld gebruikt voor de mailadressen. Kan geen spaties bevatten.',
    } as Field<'text'>
  ]
})