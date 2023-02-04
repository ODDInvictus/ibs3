import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ request }) => {
  const body: { user: number } = await request.json();

  return Response();
};
