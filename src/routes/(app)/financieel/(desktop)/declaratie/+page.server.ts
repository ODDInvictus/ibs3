import db from '$lib/server/db'
import cdn from '$lib/server/cdn'
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types'
import { RECEIPT_BUCKET } from '$env/static/private';

// export const load = (async () => {
//   const products = await db.product.findMany({
//     where: {
//       isActive: true
//     }
//   })

//   return {
//     products
//   }
// }) satisfies PageServerLoad


type FormData = {
  product: string
  methode: string
  prijs: string
  statiegeld: string
  receipt: Blob
}

export const actions = {
  default: async (event) => {
    try {
      const data = Object.fromEntries(await event.request.formData()) as unknown as FormData

      const receipt = Buffer.from(await (data.receipt as Blob).arrayBuffer())

      // save declaration
      if (!data.product || data.product === '') throw new Error('Product is verplicht')
      if (!data.methode || data.methode === '') throw new Error('Methode is verplicht')
      if (!data.prijs || parseFloat(data.prijs) < 0.01) throw new Error('Prijs is verplicht')
      if (!data.statiegeld || parseFloat(data.statiegeld) < 0) throw new Error('Statiegeld is verplicht of onder 0')
      if (!data.receipt) throw new Error('Bonnetje is verplicht')

      const prijs = parseFloat(data.prijs)
      const statiegeld = parseFloat(data.statiegeld)

      const user = event.locals.user

      const personData = await db.financialPersonDataUser.findUnique({
        where: {
          personId: user.id
        }
      })

      if (!personData) throw new Error('Geen persoonsgegevens gevonden')

      await db.$transaction(async (tx) => {
        // Create object in database
        const declaration = await tx.declaration.create({
          data: {
            price: prijs,
            reason: data.product,
            methodOfPayment: data.methode,
            personId: personData.personId,
            }
          })

        if (statiegeld > 0) {
          await tx.declaration.create({
            data: {
              price: statiegeld,
              reason: 'Statiegeld voor declaratie: ' + declaration.id,
              methodOfPayment: data.methode,
              personId: personData.personId
            }
          })
        }

        const filename = `receipt-${declaration.id}-${data.receipt.name}`

        await tx.declaration.update({
          where: {
            id: declaration.id
          },
          data: {
            receipt: filename
          }
        })

        // save the receipt      
        await cdn.putObject(RECEIPT_BUCKET, filename, receipt, {
          'Content-Type': data.receipt.type
        })
      })

      return {
        success: true,
        message: 'Declaratie is opgeslagen'
      }

    } catch (err: Error) {
      console.error(err)
      return fail(400, { succes: false, message: err.message ?? 'Internal Error' })
    }
  }
} satisfies Actions