<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	let locations = $page.data.locations;
</script>

<Title title="Locaties" />

{#each locations as location}
	<div><a href="/locatie/{location.id}">{location.name}</a></div>
{/each}
