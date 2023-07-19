import db from '$lib/server/db';
import type { PageServerLoad } from '../../$types';

export const load = (async () => {
  return {
    committees: await db.committee.findMany({
      where: {
        isActive: true
      },
      include: {
        CommitteeMember: {
          select: {
            id: true,
            member: {
              select: {
                firstName: true,
                lastName: true,
                nickname: true,
              }
            }
          }
        }
      }
    }),
    users: await db.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
      }
    })
  }
}) satisfies PageServerLoad