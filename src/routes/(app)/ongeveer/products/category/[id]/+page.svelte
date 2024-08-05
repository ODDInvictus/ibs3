<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { toast } from '$lib/notification'

	export let data: PageData

	let loading = false
</script>

<Title title={data.catergory.name} />

<div class="ongeveer-nav">
	<a href="/ongeveer/products/category">Terug</a>
	<a href="/ongeveer/products/category/create?id={data.catergory.id}">Bewerken</a>
	<button
		class="btn-danger"
		data-testid="delete-btn"
		on:click={async () => {
			if (loading || !confirm('Weet je zeker dat je deze categorie EN ALLE PRODUCTEN wilt verwijderen?')) return
			loading = true
			const res = await fetch(`/ongeveer/products/category/${data.catergory.id}`, {
				method: 'DELETE',
			})
			if (res.ok) {
				location.href = '/ongeveer/products/category'
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

<main>
	<table class="ongeveer-table">
		<h2>Info</h2>
		<tr>
			<th>ID</th>
			<td>{data.catergory.id}</td>
		</tr>
		<tr>
			<th>Naam</th>
			<td>{data.catergory.name}</td>
		</tr>
		<tr>
			<th>Beschrijving</th>
			<td>{data.catergory.description}</td>
		</tr>
		<tr>
			<th>Actief</th>
			<td>{data.catergory.isActive}</td>
		</tr>
		<tr>
			<th>Created at</th>
			<td>{formatDateTimeHumanReadable(data.catergory.createdAt)}</td>
		</tr>
		<tr>
			<th>Updated at</th>
			<td>{formatDateTimeHumanReadable(data.catergory.updatedAt)}</td>
		</tr>
	</table>

	<table class="ongeveer-table">
		<h2>Producten</h2>
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
</main>

<style lang="scss">
	h2 {
		margin-top: 1rem;
	}
</style>
