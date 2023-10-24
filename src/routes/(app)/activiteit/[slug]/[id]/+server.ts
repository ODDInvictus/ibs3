import type { RequestHandler } from "./$types";
import db from "$lib/server/db";

type RequestType = {
  status: boolean
  activityId: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { status, activityId }: RequestType = await request.json();
  const user = locals.user

  const att = await db.attending.findFirst({
    where: {
      userId: user.id,
      activityId
    },
  })

  if (!att) {
    await db.attending.create({
      data: {
        isAttending: status,
        activityId,
        userId: user.id
      }
    })
  } else {
    await db.attending.update({
      where: {
        id: att.id
      },
      data: {
        isAttending: status
      }
    })
  }

  return new Response(JSON.stringify({
    attending: await db.attending.findFirst({
      where: {
        userId: user.id,
        activityId
      },
      include: {
        user: true
      }
    })
  }))
};
