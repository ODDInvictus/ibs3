<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import CategoriesTable from '../CategoriesTable.svelte';

	export let data: PageData;
</script>

<Title title="Inactieve product categorieën" />

<div class="nav">
	<a href="/ongeveer/products/category" class="button">Terug</a>
</div>

<CategoriesTable categories={data.categories} />

<style>
	.nav {
		display: flex;
		margin-bottom: 1rem;
		gap: 1rem;
	}
</style>
