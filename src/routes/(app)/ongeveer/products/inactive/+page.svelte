<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import ProductsTable from '../ProductsTable.svelte';

	export let data: PageData;
</script>

<Title title="Inactieve producten" />

<div class="nav">
	<a href="/ongeveer/products" class="button">Terug</a>
</div>

<ProductsTable products={data.products} />

<style>
	.nav {
		display: flex;
		margin-bottom: 1rem;
		gap: 1rem;
	}
</style>
