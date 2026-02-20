<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { toast } from '$lib/notification'
	import { formatPrice } from '$lib/textUtils'
	import type { PageData } from './$types'

	export let data: PageData

	let loading = false
</script>

<Title title={data.product.name} />

<div class="ongeveer-nav">
	<a href="/ongeveer/products">Terug</a>
	<a href="/ongeveer/products/create?id={data.product.id}">Bewerken</a>
	<button
		class="btn-danger"
		data-testid="delete-btn"
		on:click={async () => {
			if (loading || !confirm('Weet je zeker dat je dit product wilt verwijderen?')) return
			loading = true
			const res = await fetch(`/ongeveer/products/${data.product.id}`, { method: 'DELETE' })
			if (res.ok) {
				location.href = '/ongeveer/products'
			} else {
				const message = await res.text()
				toast({
					type: 'danger',
					message,
					title: 'Error',
				})
				loading = false
			}
		}}>Verwijderen</button>
</div>

<table class="ongeveer-table">
	<tbody>
		<tr>
			<th>ID</th>
			<td>{data.product.id}</td>
		</tr>
		<tr>
			<th>Naam</th>
			<td>{data.product.name}</td>
		</tr>
		<tr>
			<th>Beschrijving</th>
			<td>{data.product.description}</td>
		</tr>
		<tr>
			<th>Prijs</th>
			<td>{formatPrice(data.product.price)}</td>
		</tr>
		<tr>
			<th>Categorie</th>
			<td>
				<a href="/ongeveer/products/category/{data.product.category.id}">
					{data.product.category.id} - {data.product.category.name}
				</a>
			</td>
		</tr>
		<tr>
			<th>Product Type</th>
			<td>{data.product.productType}</td>
		</tr>
		<tr>
			<th>Created at</th>
			<td>{formatDateTimeHumanReadable(new Date(data.product.createdAt))}</td>
		</tr>
		<tr>
			<th>Updated at</th>
			<td>{formatDateTimeHumanReadable(new Date(data.product.updatedAt))}</td>
		</tr>
		<tr>
			<th>isActive</th>
			<td>{data.product.isActive}</td>
		</tr>
		{#if data.product.data && Object.keys(data.product.data).length > 0}
			<tr><td>Other data</td></tr>
			{#each Object.entries(data.product.data ?? {}) as [key, value]}
				<tr>
					<th>{key}</th>
					<td>{value}</td>
				</tr>
			{/each}
		{/if}
	</tbody>
</table>
