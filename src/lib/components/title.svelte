<script lang="ts">
	import { page } from '$app/stores'
	import { stripMarkdown, markdown as md } from '$lib/utils'

	interface Props {
		title?: string | undefined
		shortTitle?: string | undefined
		underTitle?: string | undefined
		markdown?: boolean
		children?: import('svelte').Snippet
	}

	let { title = '', shortTitle = '', underTitle = '', markdown = false, children }: Props = $props()

	let ongeveer = $page.url.pathname.startsWith('/ongeveer')
</script>

<svelte:head>
	{#if markdown}
		<title>{stripMarkdown(shortTitle || title)} - {ongeveer ? 'Ongeveer' : 'IBS'}</title>
	{:else if title || shortTitle}
		<title>{shortTitle || title} - {ongeveer ? 'Ongeveer' : 'IBS'}</title>
	{:else}
		<title>Invictus Bier Systeem</title>
	{/if}
</svelte:head>

{#if markdown}
	<h1>{@html md(title)}</h1>
{:else if title}
	<h1>{title}</h1>
{:else}
	{@render children?.()}
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
