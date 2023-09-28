<script lang="ts">
	import type { PageData } from './$types';
	import Tracklist from '../../Tracklist.svelte';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title={`${data.user?.firstName} zijn playlist`} />
<Tracklist tracks={data.tracks.body.tracks} liked={data.liked} playlist={data.playlist} />
<div class="pagination">
	{#if data.page > 0}
		<a href={`/playlist/create/${data.user.id}?p=${data.page}`}>{data.page}</a>
	{/if}
	<p>{data.page + 1}</p>
	<a href={`/playlist/create/${data.user.id}?p=${data.page + 2}`}>{data.page + 2}</a>
</div>

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
