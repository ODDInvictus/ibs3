<script lang="ts">
	import type { PageData } from './$types';
	import Tracklist from '../../Tracklist.svelte';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

{#if !data.user}
	<h1>Gebruiker niet gevonden</h1>
{:else}
	<Title title={`${data.user?.firstName} zijn playlist`} />
	<Tracklist tracks={data.tracks} liked={data.liked} playlist={data.playlist} />
	<div class="pagination">
		{#if data.page > 1}
			<a href={`/playlist/create/${data.user.id}?p=${data.page - 1}`}>{data.page - 1}</a>
		{/if}
		<p>{data.page}</p>
		{#if data.page < data.maxPage}
			<a href={`/playlist/create/${data.user.id}?p=${data.page + 1}`}>{data.page + 1}</a>
		{/if}
	</div>
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
