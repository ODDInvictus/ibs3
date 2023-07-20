import { Form } from './form-generator';

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
    },
    // {
    //   label: 'Leeftijd',
    //   name: 'age',
    //   type: 'number',
    //   minValue: 50,
    //   value: 44
    // },
    {
      label: 'Geboortedatum',
      name: 'birthdate',
      type: 'date',
    },
    // {
    //   label: 'Tijd',
    //   name: 'time',
    //   type: 'time',
    //   value: '12:00',
    // },
    // {
    //   label: 'Checkbox-true',
    //   name: 'checkbox',
    //   type: 'checkbox',
    //   value: true,
    // },
    // {
    //   label: 'Checkbox-false',
    //   name: 'checkbox',
    //   type: 'checkbox',
    //   description: 'Dit is een checkbox',
    // },
    // {
    //   label: 'Select',
    //   name: 'select',
    //   type: 'select',
    //   options: [
    //     {
    //       label: 'Optie 1',
    //       value: 'optie-1'
    //     },
    //     {
    //       label: 'Optie 2',
    //       value: 'optie-2'
    //     },
    //     {
    //       label: 'Optie 3',
    //       value: 'optie-3'
    //     }
    //   ]
    // },
    // {
    //   label: 'User',
    //   name: 'user',
    //   description: 'Dit is een gebruiker',
    //   type: 'user',
    // }
  ],
  submitStr: 'Verstuur',
})