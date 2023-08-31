import { redirect } from '@sveltejs/kit';
import db from '$lib/server/db';

export async function GET({ params, locals }) {
  const { key } = params;

  // Find the link
  const link = await db.link.findFirst({
    where: {
      shortLink: key
    }
  })

  if (!link) {
    throw redirect(302, '/s/error')
  }

  // Now create a link click
  if (locals.user) {
    await db.linkClick.create({
      data: {
        linkId: link.id,
        userId: locals.user.id,
      }
    })
  }

  // Redirect the user
  throw redirect(302, link.link)
}