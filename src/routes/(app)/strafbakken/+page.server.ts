import type { Actions, PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load = (async () => {
  return {
    strafbakken: await db.user.findMany({
      select: {
        firstName: true,
        nickname: true,
        id: true,
        _count: {
          select: { StrafbakReceived: true },
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
    const giverId = 1; // TODO: Koppelen aan de ID van de ingelogde user

    console.log(reason, receiverId, giverId);

    await db.strafbak.create({
      data: {
        giverId,
        receiverId,
        reason,
      },
    });
  },
} satisfies Actions;
