import type { PageServerLoad } from '../$types';
import db from '$lib/server/db';

export const load = (async () => {
  return {
    domain: process.env.EMAIL_DOMAIN,
    users: await db.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        ldapId: true
      }
    })
  };
}) satisfies PageServerLoad;