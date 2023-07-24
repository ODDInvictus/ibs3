import type { PageServerLoad } from './$types';
import db from '$lib/server/db'

export const load = (async ({ locals }) => {
  return {
    preferences: db.preference.findMany({
      where: {
        userId: locals.user.id
      },
      include: {
        base: true
      }
    })
  };
}) satisfies PageServerLoad;