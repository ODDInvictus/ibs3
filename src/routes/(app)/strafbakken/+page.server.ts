import type { Actions, PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async () => {
  return {
    strafbakken: await db.user.findMany({
      select: {
        firstName: true,
        nickname: true,
        id: true,
        _count: {
          select: {
            StrafbakReceived: {
              where: {
                dateDeleted: null,
              },
            },
          },
        },
      },
    }),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const reason = data.get("reason")?.toString() || undefined;
    const receiverId = Number(data.get("receiver"));
    const giverEmail = data.get("giver")?.toString();

    const giver = await db.user.findUnique({
      where: {
        email: giverEmail,
      },
      select: {
        id: true,
      },
    });

    const giverId = giver ? giver.id : 1;

    await db.strafbak.create({
      data: {
        giverId,
        receiverId,
        reason,
      },
    });
  },
} satisfies Actions;
