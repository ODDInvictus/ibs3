<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { generateRandomString } from '$lib/utils';

	const { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } = env;

	const scopes = [
		'user-read-private',
		'user-read-email',
		'playlist-modify-public',
		'playlist-modify-private'
	];
	const state = generateRandomString(16);

	$: authorizeURL = `https://accounts.spotify.com/authorize?client_id=${PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
		PUBLIC_SPOTIFY_REDIRECT_URI
	)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}&show_dialog=true`;
</script>

<a id="login-btn" href={authorizeURL}> Get refresh token </a>

<style lang="scss">
	#login-btn {
		background-color: #1db954;
		padding: 1rem;
		color: white;
		border-radius: 2rem;
		text-decoration: none;
		margin-top: 20px;
		font-size: 2rem;

		&:hover {
			background-color: #1ed760;
		}
	}
</style>
