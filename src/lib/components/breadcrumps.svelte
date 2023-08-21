<script lang="ts">
	import { page } from '$app/stores';
	import { breadcrumbStore, generateBreadcrumbs } from '$lib/breadcrumbStore';
	import { markdown } from '$lib/utils';
	import ChevronRight from '~icons/tabler/chevron-right';

	$: generateBreadcrumbs($page.route.id ?? $page.url.pathname, $page.url.pathname);
</script>

<nav>
	{#each $breadcrumbStore as c, i}
		{#if i == $breadcrumbStore.length - 1}
			<span>{@html markdown(c.label)}</span>
		{:else}
			<a href={c.href}>
				<span>{@html markdown(c.label)}</span>
			</a>
			<i><ChevronRight width="1.2em" height="1.2em" /></i>
		{/if}
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.3rem;
	}

	span,
	i {
		display: inline-block;
	}

	a {
		color: var(--color-text-light);
	}

	i {
		padding-top: 0.2rem;
	}

	span::first-letter {
		text-transform: capitalize;
	}
</style>
