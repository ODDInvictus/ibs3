<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import CategoriesTable from './CategoriesTable.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Product categorieën" />

<div class="ongeveer-nav">
	<a href="/ongeveer/products/category/create">Nieuwe categorie</a>
	<a href="/ongeveer/products/category/inactive">Inactive categorieën</a>
	<a href="/ongeveer/products">Terug</a>
</div>

<CategoriesTable categories={data.categories} />
