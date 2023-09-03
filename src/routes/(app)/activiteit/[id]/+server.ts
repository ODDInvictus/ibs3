import type { RequestHandler } from "./$types";
import db from "$lib/server/db";
import { activitySlug } from '$lib/textUtils';
import { redirect } from '@sveltejs/kit';

type RequestType = {
  status: boolean
  activityId: number
}

// rewrite the url to /activiteit/[slug]/id
export const GET: RequestHandler = async ({ request, params }) => {
  const id = params.id

  // Get activity
  const activity = await db.activity.findUnique({
    where: {
      id: Number(id),
    }
  })

  if (!activity) {
    return new Response("Activity not found", {
      status: 404,
    });
  }

  const slug = activitySlug(activity.name)

  throw redirect(301, `/activiteit/${slug}/${id}`)

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
