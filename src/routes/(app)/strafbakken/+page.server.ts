import type { Actions, PageServerLoad } from "./$types";
import db from "$lib/server/db";
import { getUser } from "$lib/server/userCache";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

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
  default: async (event) => {
    const { request, locals } = event;

    // Probeer de user te vinden als dat niet lukt om de een of andere reden, dan is het onsuccesvol
    // @ts-expect-error
    let giverId = locals.user?.id;
    if (!giverId) {
      const session = await locals.getSession();
      const user = await getUser(session);
      giverId = user?.id;
    }
    if (!giverId) return fail(400);

    const data = await request.formData();
    const reason = data.get("reason")?.toString() || undefined;
    const receiverId = Number(data.get("receiver"));
    const ip = event.getClientAddress();
    let location = undefined;
    if (ip === env.COLOSSEUM_IP) location = "Colosseum";
    else if (ip.startsWith(env.CAMPUS_IP)) location = "Campus";
    else {
      const res = await fetch(`http://www.geoplugin.net/json.gp?ip=${ip}`);
      const { geoplugin_city } = await res.json();
      if (geoplugin_city) location = geoplugin_city;
    }

    try {
      await db.strafbak.create({
        data: {
          giverId,
          receiverId,
          reason,
          location,
        },
      });
    } catch {
      // Oftewel, de receiverId bestaat niet
      return fail(400);
    }
    return { succes: true };
  },
} satisfies Actions;
