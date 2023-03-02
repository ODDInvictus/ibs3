import db from "$lib/server/db";
import type { PageServerLoad } from "../$types";

export const load = (async ({ params }) => {
  return {
    committee: await db.committee.findUniqueOrThrow({
      where: {
        // @ts-expect-error
        ldapId: params.commissie,
      },
      include: {
        CommitteeMember: {
          include: {
            member: {
              select: {
                nickname: true,
                firstName: true,
                ldapId: true,
              },
            },
          },
          where: {
            leaveDate: null,
          },
        },
      },
    }),
    users: await db.$queryRaw`
      SELECT u.id, u.firstName, u.nickname
      FROM user AS u
      WHERE u.id NOT IN (
        SELECT cm.userId
        FROM committeeMember AS cm, committee AS c
        WHERE c.ldapId = ${
          // @ts-expect-error
          params.commissie
        }
        AND cm.committeeId = c.id
      );
    `,
  };
}) satisfies PageServerLoad;
