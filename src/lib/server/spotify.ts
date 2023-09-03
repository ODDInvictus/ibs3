import SpotifyWebApi from 'spotify-web-api-node';
import db from './db';
import { env as privateEnv } from '$env/dynamic/private';
import { env } from '$env/dynamic/public';

const { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } = env;

const credentials = {
	clientId: PUBLIC_SPOTIFY_CLIENT_ID,
	clientSecret: privateEnv.SPOTIFY_CLIENT_SECRET,
	redirectUri: PUBLIC_SPOTIFY_REDIRECT_URI
};

const spotify = new SpotifyWebApi(credentials);

export const refreshToken = async () => {
	const refreshToken = (
		await db.settings.findUnique({
			where: {
				name: 'SPOTIFY_REFRESH_TOKEN'
			},
			select: {
				value: true
			}
		})
	)?.value;
	if (!refreshToken)
		throw new Error('No refresh token found in database, the name should be SPOTIFY_REFRESH_TOKEN');

	spotify.setRefreshToken(refreshToken);
	const accessToken = (await spotify.refreshAccessToken()).body.access_token;
	spotify.setAccessToken(accessToken);
};

export default spotify;
