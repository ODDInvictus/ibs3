import { testForm } from './form';

export const load = (async () => {

  await testForm.transform()

  return {
    form: testForm.attributes
  }

})

export const actions = testForm.actions