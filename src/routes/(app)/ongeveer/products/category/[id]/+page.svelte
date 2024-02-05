<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title={data.catergory.name} />

<div class="ongeveer-nav">
	<a href="/ongeveer/products/category">Terug</a>
	<a href="/ongeveer/products/category/create?id={data.catergory.id}">Bewerken</a>
</div>

<h2>Info</h2>
<table>
	<tr>
		<td>ID</td>
		<td>{data.catergory.id}</td>
	</tr>
	<tr>
		<td>Naam</td>
		<td>{data.catergory.name}</td>
	</tr>
	<tr>
		<td>Beschrijving</td>
		<td>{data.catergory.description}</td>
	</tr>
	<tr>
		<td>Actief</td>
		<td>{data.catergory.isActive}</td>
	</tr>
	<tr>
		<td>Created at</td>
		<td>{formatDateTimeHumanReadable(data.catergory.createdAt)}</td>
	</tr>
	<tr>
		<td>Updated at</td>
		<td>{formatDateTimeHumanReadable(data.catergory.updatedAt)}</td>
	</tr>
</table>

<h2>Producten</h2>
<table class="small">
	<thead>
		<th>ID</th>
		<th>Naam</th>
	</thead>
	<tbody>
		{#each data.products as product}
			<tr>
				<td><a href="/ongeveer/products/{product.id}">{product.id}</a></td>
				<td>{product.name}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	h2 {
		margin-top: 1rem;
	}
</style>
