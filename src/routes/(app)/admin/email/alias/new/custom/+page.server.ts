import type { PageServerLoad } from '../$types';

export const load = (async () => {
  return {
    domain: process.env.EMAIL_DOMAIN,
  };
}) satisfies PageServerLoad;