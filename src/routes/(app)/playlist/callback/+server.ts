import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import spotify from "$lib/server/spotify";

export const GET: any = ({ request }: { request: any }) => {
  const params = new URLSearchParams(new URL(request.url).search);
  const code = params.get("code");
  if (!code) return Response.redirect("/playlist?error=No code", 303);

  return spotify
    .authorizationCodeGrant(code)
    .then(
      (data) => {
        return new Response("Redirect", {
          status: 303,
          headers: { Location: "/playlist?data=" + JSON.stringify(data.body) },
        });
      },
      (error) => {
        console.error(error);
        return new Response("Redirect", {
          status: 303,
          headers: { Location: "/playlist?data=" + 1 },
        });
      }
    )
    .catch((error) => {
      console.error(error);
      return new Response("Redirect", {
        status: 303,
        headers: { Location: "/playlist?data=" + 1 },
      });
    });
};
