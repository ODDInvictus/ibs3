import { maluspuntForm } from './form';

export const load = (async ({ locals }) => {

  await maluspuntForm.transform(locals.user)

  return {
    form: maluspuntForm.attributes
  }

})

export const actions = maluspuntForm.actions