import type { RequestHandler } from './$types';
import db from '$lib/server/db'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  switch (body.type) {
    case 'new_tag':
      return await newTag(body);
    default:
      return err(400, 'Invalid request type')
  }
};

function success(data: any, msg: string) {
  return new Response(JSON.stringify({
    message: msg,
    data,
    success: true
  }))
}

function err(status: number, msg: string) {
  return new Response(JSON.stringify({
    message: msg,
    status,
    success: false
  }))
}

type NewTagBodyType = {
  type: 'new_tag',
  tag: string,
}

async function newTag(body: NewTagBodyType) {

  if (!body.tag) return err(400, 'No tag provided')

  const tag = await db.photoTag.upsert({
    where: {
      name: body.tag
    },
    create: {
      name: body.tag
    },
    update: {}
  })

  return success(tag, 'Tag created')
}