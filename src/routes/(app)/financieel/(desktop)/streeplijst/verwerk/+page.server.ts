import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async () => {
  return {
    test: 'huts',
    financialPeople: await db.financialPerson.findMany({
      where: {
        isActive: true
      }
    }),
    products: await db.product.findMany()
  };
}) satisfies PageServerLoad;
