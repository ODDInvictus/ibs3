import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import db from "$lib/server/db";
import { Prisma } from "@prisma/client";

export const load = (async () => {
  return {
    committees: await db.committee.findMany(),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }: { request: Request }) => {
    // TODO authorization

    const data = await request.formData();
    const name = data.get("name")?.toString();
    if (!name) return fail(400);
    console.log(name);

    try {
      await db.committee.create({
        data: {
          name,
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
