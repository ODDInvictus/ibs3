import type { PageServerLoad } from "./$types";
import db from "$lib/server/db";

export const load = (async () => {
  const financialPeople = await db.financialPerson.findMany()
  const products = await db.product.findMany()

  return {
    test: 'huts',
    financialPeople,
    products
  };
}) satisfies PageServerLoad;
