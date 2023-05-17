import db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    // Get the request form
    const form = await request.formData();

    const url = String(form.get('url'));
    let slug = String(form.get('slug'));

    if (!slug) {
      // Generate an unique slug
      slug = Math.random().toString(36).substring(2, 7);
    }

    // if the generated slug is already in use, just give up haha

    if (slug) {
      // Check if the slug is already taken
      const existing = await db.link.findFirst({
        where: {
          shortLink: slug
        }
      })

      if (existing) {
        throw fail(400, {
          error: 'Verkorting is al in gebruik'
        })
      }
    }

    // Create the link
    await db.link.create({
      data: {
        link: url,
        shortLink: slug,
        userId: locals.user.id,
      }
    })

    throw redirect(302, '/short/success?slug=' + slug)
  }
}