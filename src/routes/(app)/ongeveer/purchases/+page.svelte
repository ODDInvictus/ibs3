<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Inkoop" />

<div class="links">
	<a href="/ongeveer/purchases/create/invoice" class="button">Factuur inboeken</a>
	<a href="/ongeveer/puchases/create/declaration" class="button">Declaratie inboeken</a>
</div>

<h2>Facturen</h2>
<table>
	<thead>
		<th>ID</th>
		<th>Referentie</th>
		<th>Bedrag</th>
		<th>Relatie</th>
		<th>Datum</th>
		<th>Status</th>
	</thead>
	<tbody>
		{#each data.invoices as invoice}
			<tr>
				<td><a href="/ongeveer/purchases/create?id={invoice.id}">{invoice.id}</a></td>
				<td>{invoice.ref ?? ''}</td>
				<td>{invoice.total}</td>
				<td>{invoice.relation}</td>
				<td>{invoice.date ?? ''}</td>
				<td>Open</td>
			</tr>
		{/each}
	</tbody>
</table>
<h2 class="mt-1">Declaraties</h2>
<table>
	<thead>
		<th>ID</th>
		<th>Referntie</th>
		<th>Bedrag</th>
		<th>Relatie</th>
		<th>Datum</th>
		<td>Status</td>
	</thead>
</table>

<style>
	.links {
		padding: 1rem 0;
		display: flex;
		gap: 1rem;
	}

	.mt-1 {
		margin-top: 1rem;
	}
</style>
