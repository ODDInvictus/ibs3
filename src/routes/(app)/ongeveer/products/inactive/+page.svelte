<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import ProductsTable from '../ProductsTable.svelte';

	export let data: PageData;
</script>

<Title title="Inactieve producten" />

<div class="ongeveer-nav">
	<a href="/ongeveer/products">Terug</a>
</div>

<ProductsTable products={data.products} />
