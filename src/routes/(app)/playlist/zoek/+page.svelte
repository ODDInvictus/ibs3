<script lang="ts">
	import { onMount } from 'svelte'
	import Tracklist from '../Tracklist.svelte'
	import Title from '$lib/components/title.svelte'
	import Loader from '$lib/components/Loader.svelte'
	import { toast } from '$lib/notification'
	import Playlist from '~icons/tabler/playlist'
	import { env } from '$env/dynamic/public'

	import type { PageServerData } from './$types'
	import UserList from '../UserList.svelte'

	interface Props {
		data: PageServerData
	}

	let { data }: Props = $props()

	const { PUBLIC_PLAYLIST_ID } = env

	let mounted = $state(false)

	onMount(() => {
		mounted = true
	})

	let search = $state('')
	let tracks: Promise<SpotifyApi.TrackObjectFull[] | null> = $derived(
		(async () => {
			if (!mounted || !search) return null
			const res = await searchTracks(search)
			if (res.ok) return res.json()
			else throw new Error('Error tijdens het zoeken')
		})(),
	)

	const searchTracks = async (search: string) => {
		return await fetch(`/playlist/zoek?s=${encodeURIComponent(search)}`)
	}
</script>

<Title title="Playlist" />
<main>
	{#if mounted}
		<input type="text" name="search" bind:value={search} placeholder="Zoek een nummer..." />

		{#if search === ''}
			<a href={`https://open.spotify.com/playlist/${PUBLIC_PLAYLIST_ID}`} target="_blank"> Naar de playlist </a>
			<h3>Bekijk anderen hun playlist:</h3>
			<div class="lists">
				<UserList users={data.users.slice(0, Math.floor(data.users.length / 2))} />
				<UserList users={data.users.slice(Math.floor(data.users.length / 2))} />
			</div>
		{/if}

		{#await tracks}
			<div class="loader">
				<Loader />
			</div>
		{:then tracks}
			{#if tracks}
				<Tracklist {tracks} {search} liked={data.liked} playlist={data.playlist} />
			{:else if search !== ''}
				<p>Geen resultaten</p>
			{/if}
		{:catch error}
			{toast({
				title: 'Error',
				message: error,
				type: 'danger',
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
		padding: 0.5rem;
		font-size: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		max-width: 700px;
	}

	.loader {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 200px;
	}

	.lists {
		display: flex;
		justify-content: space-around;

		@media (min-width: 640px) {
			justify-content: flex-start;
			gap: 3rem;
		}
	}

	main {
		display: flex;
		gap: 20px;
		flex-direction: column;
	}
</style>
