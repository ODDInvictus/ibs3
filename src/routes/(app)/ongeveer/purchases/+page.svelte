<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { toDateString } from '$lib/dateUtils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Inkoop" />

<div class="links">
	<a href="/ongeveer/purchases/create?type=INVOICE" class="button">Factuur inboeken</a>
	<a href="/ongeveer/purchases/create?type=DECLARATION" class="button">Declaratie inboeken</a>
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
				<td><a href="/ongeveer/purchases/{invoice.id}">{invoice.id}</a></td>
				<td>{invoice.ref ?? ''}</td>
				<td>€ {invoice.total}</td>
				<td
					><a href="/ongeveer/relations/{invoice.relationId}"
						>{invoice.relationId} - {invoice.relation}</a
					></td
				>
				<td>{invoice.date ? toDateString(new Date(invoice.date)) : ''}</td>
				<!-- TODO get status -->
				<td>Open</td>
			</tr>
		{/each}
	</tbody>
</table>
<h2 class="mt-1">Declaraties</h2>
<table>
	<thead>
		<th>ID</th>
		<th>Referentie</th>
		<th>Bedrag</th>
		<th>Relatie</th>
		<th>Datum</th>
		<td>Status</td>
	</thead>
	<tbody>
		{#each data.declarations as declaration}
			<tr>
				<td><a href="/ongeveer/purchases/create?id={declaration.id}">{declaration.id}</a></td>
				<td>{declaration.ref ?? ''}</td>
				<td>€ {declaration.total}</td>
				<td>
					<a href="/ongeveer/relations/{declaration.relationId}">
						{declaration.relationId} - {declaration.relation}
					</a>
				</td>
				<td>{declaration.date ? toDateString(new Date(declaration.date)) : ''}</td>
				<!-- TODO get status -->
				<td>Open</td>
			</tr>
		{/each}
	</tbody>
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
