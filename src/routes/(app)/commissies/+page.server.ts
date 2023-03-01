import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import db, { getSenaat } from "$lib/server/db";
import { Prisma } from "@prisma/client";

export const load = (async () => {
  return {
    committees: await db.committee.findMany(),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // Authorization
    //@ts-expect-error
    const user = locals.user;
    const senaat = await getSenaat();
    let isSenaat = false;
    for (let i = 0; i < senaat.length; i++) {
      if (senaat[i].id === user.id) {
        isSenaat = true;
        break;
      }
    }
    if (!isSenaat) return fail(401);

    const data = await request.formData();
    const name = data.get("name")?.toString();
    if (!name) return fail(400, { message: "Geen naam opgegeven" });

    try {
      await db.committee.create({
        data: {
          name: name,
          ldapId: name.toLowerCase(),
        },
      });
      return { succes: true };
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return fail(400, { message: `De naam ${name} bestaat al` });
      return fail(500);
    }
  },
} satisfies Actions;
