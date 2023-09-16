<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<Title title={data.egg?.name ?? 'Niet gevonden'} />
{#if !data.egg}
	<p>Dat ID ken ik niet</p>
{:else}
	<p>ei</p>
{/if}
<a href="localhost:5173/pasen/gevonden/123">test</a>
