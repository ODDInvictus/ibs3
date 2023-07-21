import { Form } from './form-generator';
import type { Field, SelectField, UserField, CheckboxField } from './form-generator';

export const testForm = new Form<{
  select: string
}>({
  title: 'Nieuwe iets',
  description: 'Dit is een form die automatisch gegenereerd is.',
  logic: async (data) => {
    console.log(data)
  },
  formId: 'test-form',
  fields: [
    {
      label: 'Naam',
      name: 'name',
      minLength: 5,
      description: 'Dit is een beschrijving',
      type: 'text',
      value: 'Naam',
    } as Field<'text'>,
    {
      label: 'Leeftijd',
      name: 'age',
      type: 'number',
      minValue: 50,
      value: 44
    } as Field<'number'>,
    {
      label: 'Datum',
      name: 'date',
      optional: true,
      type: 'date',
    } as Field<'date'>,
    {
      label: 'Tijd',
      name: 'time',
      type: 'time',
      optional: true,
      value: '12:00',
    } as Field<'time'>,
    {
      label: 'Boolean',
      name: 'checkbox',
      type: 'checkbox',
      description: 'Dit is een checkbox',
    } as Field<CheckboxField>,
    {
      label: 'Selecteren',
      name: 'select',
      type: 'select',
      options: [
        {
          label: 'Optie 1',
          value: 'optie-1'
        },
        {
          label: 'Optie 2',
          value: 'optie-2'
        },
        {
          label: 'Optie 3',
          value: 'optie-3'
        }
      ]
    } as Field<SelectField>,
    {
      label: 'Gebruiker',
      name: 'user',
      description: 'Dit is een gebruiker',
      type: 'user',
    } as Field<UserField>
  ],
  submitStr: 'Verstuur',
})