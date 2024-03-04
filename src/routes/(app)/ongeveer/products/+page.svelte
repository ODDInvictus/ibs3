<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import ProductsTable from './ProductsTable.svelte';

	export let data: PageData;
</script>

<Title title="Producten" />

<div class="ongeveer-nav">
	<a href="/ongeveer/products/create">Nieuw product</a>
	<a href="/ongeveer/products/inactive">Inactive producten</a>
	<a href="/ongeveer/products/category">Categorieën</a>
</div>

<ProductsTable products={data.products} />
