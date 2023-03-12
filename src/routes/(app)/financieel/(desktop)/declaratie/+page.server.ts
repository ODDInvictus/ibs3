import db from '$lib/server/db'
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types'

export const load = (async () => {
  const products = await db.product.findMany({
    where: {
      isActive: true
    }
  })

  return {
    products
  }
}) satisfies PageServerLoad


export const actions = {
  default: async (event) => {
    try {
      const data = Object.fromEntries(await event.request.formData())

      const receipt = Buffer.from(await (data.receipt as Blob).arrayBuffer())

      const filePath = 'uploads/declaratie'

      // Save receipt and save declaration

    } catch (err) {
      throw fail(400, err.message ?? 'Internal Error')
    }


  }
} satisfies Actions