import { Form } from './form-generator';
import type { Field } from './form-generator';

export const testForm = new Form<{
  name: string
  description: string
  beginDate: string
  beginTime: string
  endDate: string
  endTime: string
  location: string
  organisedBy: string
  url: string
}>({
  title: 'Nieuwe activiteit aanmaken',
  description: 'Met dit formulier kan je een nieuwe activiteit aanmaken.',
  logic: async (data) => {

    return {
      success: true,
      message: 'Activiteit aangemaakt, je wordt nu doorgestuurd.',
      status: 201,
      redirectTo: '/activiteit/20'
    }
  },
  extraValidators: (data) => {
    const errors = []
    if (data.beginDate > data.endDate) {
      errors.push({
        field: 'endDate',
        message: 'De einddatum moet na de begindatum zijn.'
      })
    }
    if (data.beginDate === data.endDate && data.beginTime > data.endTime) {
      errors.push({
        field: 'endTime',
        message: 'De eindtijd moet na de begintijd zijn.'
      })
    }
    return errors
  },
  needsConfirmation: true,
  confirmText: 'Weet je zeker dat je deze activiteit wilt aanmaken?',
  formId: 'test-form',
  fields: [
    {
      label: 'Naam',
      name: 'name',
      minLength: 3,
      optional: true,
      type: 'text',
      value: '',
      placeholder: 'Leuke activiteit'
    } as Field<'text'>,
    {
      label: 'Beschrijving',
      name: 'description',
      optional: true,
      type: 'textarea',
    } as Field<'textarea'>,
    {
      label: 'Begin datum',
      name: 'beginDate',
      type: 'date',
    } as Field<'date'>,
    {
      label: 'Begin tijd',
      name: 'beginTime',
      type: 'time',
    } as Field<'time'>,
    {
      label: 'Eind datum',
      name: 'endDate',
      type: 'date',
    } as Field<'date'>,
    {
      label: 'Eind tijd',
      name: 'endTime',
      type: 'time',
    } as Field<'time'>,
    {
      label: 'Locatie',
      optional: true,
      name: 'location',
      type: 'location',
      description: 'Locatie niet in de lijst? Sla dan maar over.',
    } as Field<'location'>,
    {
      label: 'Georganiseerd door',
      name: 'organisedBy',
      description: 'Welke commissie organiseert dit?',
      type: 'committee',
      placeholder: 'Selecteer een commissie',
    } as Field<'committee'>,
    {
      label: 'Website voor meer informatie',
      optional: true,
      name: 'url',
      description: 'Website voor meer informatie',
      type: 'url',
    } as Field<'url'>,
    {
      label: 'Alleen voor leden',
      name: 'membersOnly',
      type: 'checkbox',
      description: 'Als dit geselecteerd is, zullen alleen leden deze activiteit zien.',
    } as Field<'checkbox'>,
  ],
  submitStr: 'Opslaan',
})