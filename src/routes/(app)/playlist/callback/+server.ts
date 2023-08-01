import type { RequestHandler } from "./$types";
import spotify from "$lib/server/spotify";

export const GET: any = ({ request }: { request: any }) => {
  const params = new URLSearchParams(new URL(request.url).search);
  const code = params.get("code");
  if (!code) return new Response("Redirect", { status: 303, headers: { Location: "/playlist?error=No%20code" } });

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
          headers: { Location: "/playlist?error=" + error.body.error_description ?? error.body.error },
        });
      }
    )
    .catch((error) => {
      console.error(error);
      return new Response("Redirect", {
        status: 303,
        headers: { Location: "/playlist?error=" + JSON.stringify(error) },
      });
    });
};
