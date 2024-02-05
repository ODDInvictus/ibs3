<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import { formatPrice } from '$lib/textUtils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title={data.product.name} />
<table>
	<tr>
		<td>ID</td>
		<td>{data.product.id}</td>
	</tr>
	<tr>
		<td>Naam</td>
		<td>{data.product.name}</td>
	</tr>
	<tr>
		<td>Beschrijving</td>
		<td>{data.product.description}</td>
	</tr>
	<tr>
		<td>Prijs</td>
		<td>{formatPrice(data.product.price)}</td>
	</tr>
	<tr>
		<td>Categorie</td>
		<td>
			<a href="/ongeveer/products/category/{data.product.category.id}">
				{data.product.category.id} - {data.product.category.name}
			</a>
		</td>
	</tr>
	<tr>
		<td>Product Type</td>
		<td>{data.product.productType}</td>
	</tr>
	<tr>
		<td>Created at</td>
		<td>{formatDateTimeHumanReadable(data.product.createdAt)}</td>
	</tr>
	<tr>
		<td>Updated at</td>
		<td>{formatDateTimeHumanReadable(data.product.updatedAt)}</td>
	</tr>
	<tr>
		<td>isActive</td>
		<td>{data.product.isActive}</td>
	</tr>
	{#if data.product.data && Object.keys(data.product.data).length > 0}
		<h2>Other data</h2>
		{#each Object.entries(data.product.data ?? {}) as [key, value]}
			<tr>
				<td>{key}</td>
				<td>{value}</td>
			</tr>
		{/each}
	{/if}
</table>

<div class="nav">
	<a href="/ongeveer/products" class="button">Terug</a>
	<a href="/ongeveer/products/create?id={data.product.id}" class="button">Bewerken</a>
</div>

<style>
	.nav {
		display: flex;
		margin: 1rem;
		gap: 1rem;
	}
</style>
