import type { PageServerLoad } from '../../$types';
import db from '$lib/server/db'
import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFinancialPeoplePerCategory } from '$lib/server/financial/utils';
import { isFinancie } from '$lib/server/authorization';

export const load = (async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw error(400, { message: 'No id provided' })
  }

  const sale = await db.sale.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      person: true,
      product: true,
    }
  });

  return {
    sale,
    people: await getFinancialPeoplePerCategory(),
    products: await db.product.findMany()
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params, locals }) => {
    // @ts-expect-error als je niet je eigen .d.ts kan lezen, moet je ook niet piepen
    const user: User = locals.user

    if (!isFinancie(user)) return error(403, 'Geen toegang tot deze actie!')
  

    const data = await request.formData();
    const saleID = Number(params.id);

    const personId = Number(data.get('person'));
    const productId = Number(data.get('product'));
    const amount = Number(data.get('amount'));

    if (!personId || !productId || !amount) {
      throw error(400, { message: 'Niet alle velden zijn ingevuld!' })
    }

    await db.sale.update({
      where: {
        id: saleID,
      },
      data: {
        personId,
        productId,
        amount,
      }
    })

    throw redirect(301, '/financieel/transacties')
  }
} satisfies Actions;
