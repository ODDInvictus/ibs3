import type { Actions, PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { getUser } from "$lib/server/userCache";
import { fail } from "@sveltejs/kit";

// Load een overview van alle strafbakken
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
  // Geef een strafbak
  default: async ({ request, locals }: { request: Request; locals: any }) => {
    const data = await request.formData();

    const reason = data.get("reason")?.toString() || undefined;
    const receiverId = Number(data.get("receiver"));

    // Probeer de user te vinden als dat niet lukt om de een of andere reden, dan is het onsuccesvol
    const session = await locals.getSession();
    const user = await getUser(session);
    const giverId = user?.id;
    if (!giverId) return fail(400);

    try {
      await db.strafbak.create({
        data: {
          giverId,
          receiverId,
          reason,
        },
      });
    } catch {
      return fail(400);
    }
    return { succes: true };
  },
} satisfies Actions;
