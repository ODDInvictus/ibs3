<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import CategoriesTable from '../CategoriesTable.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Inactieve product categorieën" />

<div class="ongeveer-nav">
	<a href="/ongeveer/products/category">Terug</a>
</div>

<CategoriesTable categories={data.categories} />
