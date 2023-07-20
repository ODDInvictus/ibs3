import type { PageServerLoad } from '../$types';
import { testForm } from './form';

export const load = (async () => {

  await testForm.transform()

  return {
    form: testForm.attributes
  }

}) satisfies PageServerLoad;

export const actions = testForm.actions