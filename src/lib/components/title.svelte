<script lang="ts">
	export let title: string = '';
	export let shortTitle: string | undefined = '';
</script>

<svelte:head>
	{#if title}
		<title>IBS :: {shortTitle || title}</title>
	{:else}
		<title>Invictus Bier Systeem</title>
	{/if}
</svelte:head>

<h1>Nieuwe activiteit aanmaken</h1>

<hr />

<style>
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}
</style>
