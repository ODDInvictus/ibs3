import { ory } from '$lib/server/ory';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request }) => {
    const data = await request.formData()
    const username = data.get('username')
    const password = data.get('password')

    if (!username || !password) {
      return { success: false, message: 'Vul alle velden in!' }
    }

    if (process.env.DEV === 'true') {
      console.log('DEV is set, proceeding with login')
      
    }

  },
  register: async ({ request }) => {
    const data = await request.formData()
    const username = data.get('username')
    const code = data.get('code')

    if (!username || !code) {
      return { success: false, message: 'Vul alle velden in!' }
    }



  }
} satisfies Actions