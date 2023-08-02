<script lang="ts">
	import { onMount } from 'svelte';
	import Title from '$lib/components/title.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Tracklist from './Tracklist.svelte';

	import type { PageServerData } from './$types';
	import { toast } from '$lib/notification';

	export let data: PageServerData;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	let search = '';
	let tracks: Promise<SpotifyApi.TrackObjectFull[] | null>;
	$: tracks = (async () => {
		return mounted && search ? (await (await searchTracks(search)).json()) ?? null : null;
	})();

	const searchTracks = async (search: string) => {
		return await fetch(`/playlist/zoek?s=${encodeURIComponent(search)}`);
	};
</script>

<Title title="Playlist" />
<main>
	{#if mounted}
		<input type="text" name="search" bind:value={search} placeholder="Zoeken..." />

		{#await tracks}
			<Loader />
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
		<Loader />
	{/if}
</main>

<style>
	input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
