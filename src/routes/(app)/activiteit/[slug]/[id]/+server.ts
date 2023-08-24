import type { RequestHandler } from "./$types";
import db from "$lib/server/db";
import { activitySlug } from '$lib/textUtils';

type RequestType = {
  status: boolean
  activityId: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { status, activityId }: RequestType = await request.json();
  const user = locals.user

  await db.attending.updateMany({
    where: {
      userId: user.id,
      activityId
    },
    data: {
      isAttending: status
    }
  })

  return new Response("", {
    status: 200,
  });
};
