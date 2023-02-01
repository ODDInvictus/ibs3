// @ts-expect-error
import type { PageServerLoad } from "./$types";
import db, { getMembers } from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load = (async () => {
  return {
    strafbakken: await db.user.findMany({
      select: {
        firstName: true,
        nickname: true,
        _count: {
          select: { StrafbakReceived: true },
        },
      },
    }),
  };
}) satisfies PageServerLoad;
