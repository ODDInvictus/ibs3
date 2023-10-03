import db from '$lib/server/db'
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types'
import fs from 'fs';
import { env } from '$env/dynamic/private'

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
  receipt: File
}

export const actions = {
  default: async (event) => {
    try {
      const data = Object.fromEntries(await event.request.formData()) as unknown as FormData

      // save declaration
      if (!data.product) throw new Error('Product is verplicht')
      if (!data.methode) throw new Error('Methode is verplicht')
      if (!data.prijs || parseFloat(data.prijs) < 0.01) throw new Error('Prijs is verplicht')
      if (!data.statiegeld || parseFloat(data.statiegeld) < 0) throw new Error('Statiegeld is verplicht of onder 0')
      if (!data.receipt) throw new Error('Bonnetje is verplicht')

      const prijs = parseFloat(data.prijs)
      const statiegeld = parseFloat(data.statiegeld)

      const user = event.locals.user

      const personData = await db.financialPersonDataUser.findFirst({
        where: {
          userId: user.id
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

        const filename = `receipt-${declaration.id}-${data.receipt.name}`

        if (statiegeld > 0) {
          await tx.declaration.create({
            data: {
              price: statiegeld,
              reason: 'Statiegeld voor declaratie #' + declaration.id,
              methodOfPayment: data.methode,
              personId: personData.personId,
              receipt: filename
            }
          })
        }


        await tx.declaration.update({
          where: {
            id: declaration.id
          },
          data: {
            receipt: filename
          }
        })

        // Save the receipt
        fs.writeFileSync(`${env.UPLOAD_FOLDER_OLD}/receipts/${filename}`, Buffer.from(await data.receipt.arrayBuffer()), { encoding: 'binary' })

      })

      return {
        success: true,
        message: 'Declaratie is opgeslagen. Je kan gelijk nog een declaratie doen!'
      }

    } catch (err) {
      console.error(err)
      // @ts-expect-error Tis ook nooit goed he
      return fail(400, { succes: false, message: err.message ?? 'Internal Error' })
    }
  }
} satisfies Actions