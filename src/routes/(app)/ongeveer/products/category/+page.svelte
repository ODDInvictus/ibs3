<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import CategoriesTable from './CategoriesTable.svelte';

	export let data: PageData;
</script>

<Title title="Product categorieën" />

<div class="nav">
	<a href="/ongeveer/products/category/create" class="button">Nieuwe categorie</a>
	<a href="/ongeveer/products/category/inactive" class="button">Inactive categorieën</a>
	<a href="/ongeveer/products" class="button">Terug</a>
</div>

<CategoriesTable categories={data.categories} />

<style>
	.nav {
		display: flex;
		margin-bottom: 1rem;
		gap: 1rem;
	}
</style>
