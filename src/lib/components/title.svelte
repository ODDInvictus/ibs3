<script lang="ts">
	import { stripMarkdown, markdown as md } from '$lib/utils';

	export let title: string | undefined = '';
	export let shortTitle: string | undefined = '';
	export let underTitle: string | undefined = '';
	export let markdown = false;
</script>

<svelte:head>
	{#if markdown}
		<title>{stripMarkdown(shortTitle || title)} - IBS</title>
	{:else if title || shortTitle}
		<title>{shortTitle || title} - IBS</title>
	{:else}
		<title>Invictus Bier Systeem</title>
	{/if}
</svelte:head>

{#if markdown}
	<h1>{@html md(title)}</h1>
{:else if title}
	<h1>{title}</h1>
{:else}
	<slot />
{/if}

{#if underTitle}
	<div class="under-title"><p>{underTitle}</p></div>
{/if}

<hr />

<style lang="scss">
	h1,
	p {
		text-align: center;
	}

	.under-title {
		display: flex;
		justify-content: center;
		p {
			max-width: 80%;

			@media (max-width: 600px) {
				max-width: 100%;
			}
		}
	}
</style>
