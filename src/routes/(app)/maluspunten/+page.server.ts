import type { Actions, PageServerLoad } from "./$types";
import db, { getFeuten, getMembers } from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load = (async () => {
  return {
    maluspunten: await db.maluspunt.findMany({
      include: {
        giver: true,
        receiver: true,
      },
    }),
    feuten: getFeuten(),
    members: getMembers(),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const giverId = Number(data.get("giverId"));
    const receiverId = Number(data.get("receiverId"));
    const amount = Number(data.get("amount"));
    let reason = data.get("reason")?.toString();

    console.log({ giverId, receiverId, reason, amount });

    if (!giverId || !receiverId || !reason || !amount || amount === 0) {
      return fail(400, { message: "Niet alle velden zijn ingevuld" });
    }

    if (reason === undefined || reason === null || reason === "") {
      reason = "Geen reden opgegeven";
    }

    // do not need a number check since the Number() function will return NaN if it can't parse the string

    await db.maluspunt.create({
      data: { giverId, receiverId, reason, amount },
    });
  },
} satisfies Actions;
