<script lang="ts">
	import type { PageData } from './$types'
	import Tracklist from '../../Tracklist.svelte'
	import Title from '$lib/components/title.svelte'

	export let data: PageData
</script>

{#if !data.playlistUser}
	<h1>Gebruiker niet gevonden</h1>
{:else}
	<Title title={`${data.playlistUser.nickname ?? data.playlistUser.firstName} zijn playlist`} />
	{#if data.tracks.length === 0}
		<h2>
			{data.playlistUser.nickname ?? data.playlistUser.firstName} heeft nog geen een nummer geliked!
		</h2>
	{:else}
		<Tracklist tracks={data.tracks} liked={data.liked} playlist={data.playlist} />
		<div class="pagination">
			{#if data.page > 1}
				<a href={`/playlist/create/${data.playlistUser.id}?p=${data.page - 1}`}>{data.page - 1}</a>
			{/if}
			<p>{data.page}</p>
			{#if data.page < data.maxPage}
				<a href={`/playlist/create/${data.playlistUser.id}?p=${data.page + 1}`}>{data.page + 1}</a>
			{/if}
		</div>
	{/if}
{/if}

<style>
	.pagination {
		display: flex;
		justify-content: center;
		width: 100%;
		gap: 20px;
		font-size: 1.2rem;
		padding: 40px;
	}
</style>
