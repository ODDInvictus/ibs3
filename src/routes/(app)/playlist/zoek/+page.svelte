<script lang="ts">
	import { onMount } from 'svelte';
	import Tracklist from '../Tracklist.svelte';
	import Title from '$lib/components/title.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { toast } from '$lib/notification';
	import Playlist from '~icons/tabler/playlist';
	import { env } from '$env/dynamic/public';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { PUBLIC_PLAYLIST_ID } = env;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	let search = '';
	let tracks: Promise<SpotifyApi.TrackObjectFull[] | null>;
	$: tracks = (async () => {
		if (!mounted || !search) return null;
		const res = await searchTracks(search);
		if (res.ok) return res.json();
		else throw new Error('Error tijdens het zoeken');
	})();

	const searchTracks = async (search: string) => {
		return await fetch(`/playlist/zoek?s=${encodeURIComponent(search)}`);
	};
</script>

<Title title="Playlist" />
<main>
	{#if mounted}
		<div class="top">
			<input type="text" name="search" bind:value={search} placeholder="Zoeken..." />
			<a href={`https://open.spotify.com/playlist/${PUBLIC_PLAYLIST_ID}`} target="_blank">
				<Playlist />
			</a>
		</div>

		{#await tracks}
			<div class="loader">
				<Loader />
			</div>
		{:then tracks}
			{#if tracks}
				<Tracklist {tracks} {search} liked={data.liked} playlist={data.playlist} />
			{:else}
				<p>Geen resultaten</p>
			{/if}
		{:catch error}
			{toast({
				title: 'Error',
				message: error,
				type: 'error'
			})}
		{/await}
	{:else}
		<div class="loader">
			<Loader />
		</div>
	{/if}
</main>

<style lang="scss">
	input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		max-width: 700px;
	}

	.loader {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 200px;
	}

	.top {
		display: flex;
		gap: 20px;

		a {
			font-size: 2.5rem;

			&:hover {
				opacity: 0.8;
			}
		}
	}
</style>
