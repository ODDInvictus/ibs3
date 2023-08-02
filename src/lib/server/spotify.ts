import SpotifyWebApi from 'spotify-web-api-node';
import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import SPOTIFY_CONSTANTS from '$lib/spotifyConstants';
import db from './db';

const credentials = {
	clientId: SPOTIFY_CONSTANTS.CLIENT_ID,
	clientSecret: SPOTIFY_CLIENT_SECRET,
	redirectUri: SPOTIFY_CONSTANTS.REDIRECT_URI
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
