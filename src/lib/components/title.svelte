<script lang="ts">
	export let title: string | undefined = '';
	export let shortTitle: string | undefined = '';

	export let underTitle: string | undefined = '';
</script>

<svelte:head>
	{#if title || shortTitle}
		<title>IBS :: {shortTitle || title}</title>
	{:else}
		<title>Invictus Bier Systeem</title>
	{/if}
</svelte:head>

{#if title}
	<h1>{title}</h1>
{:else}
	<slot />
{/if}

{#if underTitle}
	<p>{underTitle}</p>
{/if}

<hr />

<style>
	h1,
	p {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}
</style>
