import type { Actions, PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { getUser } from "$lib/server/userCache";

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

    // TODO: User wil een argument, maar ik wil gewoon weten wie die griep request heeft gestuurd and wat zijn ID is.
    const giver = await getUser();
    const giverId = giver.id || 1;

    await db.strafbak.create({
      data: {
        giverId,
        receiverId,
        reason,
      },
    });
  },
} satisfies Actions;
