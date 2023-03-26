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


export const actions = {
  default: async (event) => {
    try {
      const data = Object.fromEntries(await event.request.formData())

      const receipt = Buffer.from(await (data.receipt as Blob).arrayBuffer())

      // save declaration
      if (!data.product || data.product === '') throw new Error('Product is verplicht')
      if (!data.methode || data.methode === '') throw new Error('Methode is verplicht')
      if (!data.prijs || data.prijs < 0.01) throw new Error('Prijs is verplicht')
      if (!data.statiegeld || data.statiegeld < 0) throw new Error('Statiegeld is verplicht of onder 0')
      if (!data.receipt) throw new Error('Bonnetje is verplicht')

      data.prijs = parseFloat(data.prijs)
      data.statiegeld = parseFloat(data.statiegeld)

      const user = event.locals.user

      const personData = await db.financialPersonDataUser.findUnique({
        where: {
          personId: user.id
        }
      })

      if (!personData) throw new Error('Geen persoonsgegevens gevonden')


      // Create object in database
      const declaration = await db.declaration.create({
        data: {
          price: data.prijs,
          reason: data.product,
          methodOfPayment: data.methode,
          personId: personData.personId,
          }
        })

      if (data.statiegeld > 0) {
        await db.declaration.create({
          data: {
            price: data.statiegeld,
            reason: 'Statiegeld voor declaratie: ' + declaration.id,
            methodOfPayment: data.methode,
            personId: personData.personId
          }
        })
      }

      const filename = `receipt-${declaration.id}-${data.receipt.name}`

      // save the receipt      
      await cdn.putObject(RECEIPT_BUCKET, filename, receipt, {
        'Content-Type': data.receipt.type
      })

      await db.declaration.update({
        where: {
          id: declaration.id
        },
        data: {
          receipt: filename
        }
      })

      return {
        success: true,
        message: 'Declaratie is opgeslagen'
      }

    } catch (err: Error) {
      console.log('Error: ' + err.message)
      return fail(400, { succes: false, message: err.message ?? 'Internal Error' })
    }
  }
} satisfies Actions