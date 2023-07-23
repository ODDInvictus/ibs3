import type { RequestHandler } from "./$types";
import db from "$lib/server/db";
import { json } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ request }) => {
  const { user }: { user: number } = await request.json();

  const strafbak = await db.strafbak.findFirst({
    where: {
      receiverId: user,
      dateDeleted: null,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });

  if (!strafbak)
    return json(
      {
        message: `User ${user} heeft geen strafbakken`,
      },
      {
        status: 400,
      }
    );

  await db.strafbak.update({
    where: {
      id: strafbak.id,
    },
    data: {
      dateDeleted: new Date(),
    },
  });

  return new Response("", {
    status: 200,
  });
};
