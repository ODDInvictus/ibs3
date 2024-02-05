<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import ProductsTable from './ProductsTable.svelte';

	export let data: PageData;
</script>

<Title title="Producten" />

<div class="nav">
	<a href="/ongeveer/products/create" class="button">Nieuw product</a>
	<a href="/ongeveer/products/inactive" class="button">Inactive producten</a>
	<a href="/ongeveer/products/category" class="button">Categorieën</a>
</div>

<ProductsTable products={data.products} />

<style>
	.nav {
		display: flex;
		margin-bottom: 1rem;
		gap: 1rem;
	}
</style>
