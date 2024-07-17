import SpotifyWebApi from 'spotify-web-api-node'
import { env as privateEnv } from '$env/dynamic/private'
import { env } from '$env/dynamic/public'
import { Setting, settings } from './settings'

const { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } = env

const credentials = {
	clientId: PUBLIC_SPOTIFY_CLIENT_ID,
	clientSecret: privateEnv.SPOTIFY_CLIENT_SECRET,
	redirectUri: PUBLIC_SPOTIFY_REDIRECT_URI,
}

const spotify = new SpotifyWebApi(credentials)

export const refreshToken = async () => {
	const refreshToken = settings.getWithoutDefault(Setting.SPOTIFY_REFRESH_TOKEN)

	if (!refreshToken) throw new Error('No refresh token found in database, the name should be SPOTIFY_REFRESH_TOKEN')

	spotify.setRefreshToken(refreshToken)
	const accessToken = (await spotify.refreshAccessToken()).body.access_token
	spotify.setAccessToken(accessToken)
}

export default spotify
