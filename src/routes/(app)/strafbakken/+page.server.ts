// @ts-expect-error
import type { PageServerLoad } from "./$types";
import db, { getMembers } from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load = (async () => {
  return {
    strafbakken: await db.strafbak.findMany({
      where: {
        NOT: {
          dateDeleted: null,
        },
      },
    }),
    members: getMembers(),
  };
}) satisfies PageServerLoad;
