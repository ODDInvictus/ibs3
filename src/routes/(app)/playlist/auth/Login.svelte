<script lang="ts">
	import SPOTIFY_CONSTANTS from '$lib/spotifyConstants';

	const { CLIENT_ID, REDIRECT_URI } = SPOTIFY_CONSTANTS;
	const scopes = [
		'user-read-private',
		'user-read-email',
		'playlist-modify-public',
		'playlist-modify-private'
	];
	const state = generateRandomString(16);

	function generateRandomString(length: number) {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}

	$: authorizeURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
		REDIRECT_URI
	)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}&show_dialog=true`;
</script>

<a id="login-btn" href={authorizeURL}> Login met Spotify </a>

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
