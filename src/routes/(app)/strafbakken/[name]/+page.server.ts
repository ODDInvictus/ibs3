import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async ({ params }) => {
  const data = await db.user.findFirst({
    where: {
      OR: [{ firstName: params.name }, { nickname: params.name }],
    },
    select: {
      firstName: true,
      nickname: true,
      StrafbakReceived: {
        select: {
          reason: true,
          dateCreated: true,
          giver: {
            select: {
              firstName: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

  if (!data) throw error(404);

  return { strafbakken: data };
}) satisfies PageServerLoad;
