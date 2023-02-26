import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async () => {
  return {
    committees: await db.committee.findMany(),
  };
}) satisfies PageServerLoad;
