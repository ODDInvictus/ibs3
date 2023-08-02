import type { RequestHandler } from './$types';
import spotify from '$lib/server/spotify';

export const GET: any = ({ request }: { request: any }) => {
	const REDIRECT_URL = '/playlist/auth';
	const params = new URLSearchParams(new URL(request.url).search);
	const code = params.get('code');
	if (!code)
		return new Response('Redirect', {
			status: 303,
			headers: { Location: `${REDIRECT_URL}?error=No%20code` }
		});

	return spotify
		.authorizationCodeGrant(code)
		.then(
			(data) => {
				return new Response('Redirect', {
					status: 303,
					headers: { Location: `${REDIRECT_URL}?data=` + JSON.stringify(data.body) }
				});
			},
			(error) => {
				throw new Error(error);
			}
		)
		.catch((error) => {
			console.error(error);
			return new Response('Redirect', {
				status: 303,
				headers: { Location: `${REDIRECT_URL}?error=` + JSON.stringify(error) }
			});
		});
};
