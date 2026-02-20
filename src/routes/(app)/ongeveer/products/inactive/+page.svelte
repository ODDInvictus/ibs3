<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import ProductsTable from '../ProductsTable.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Inactieve producten" />

<div class="ongeveer-nav">
	<a href="/ongeveer/products">Actieve producten</a>
</div>

<ProductsTable products={data.products} />
