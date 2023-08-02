import { shortLinkForm } from './form';

export const load = (async ({ locals }) => {

  await shortLinkForm.transform(locals.user)

  return {
    form: shortLinkForm.attributes
  }

})

export const actions = shortLinkForm.actions