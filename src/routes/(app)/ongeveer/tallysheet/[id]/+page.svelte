<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatDateHumanReadable, formatDateTimeHumanReadable } from '$lib/dateUtils'

	export let data: PageData
</script>

<Title title="Streeplijst #{data.tallySheet.id}" />

<div class="ongeveer-nav">
	<a href="/ongeveer/tallysheet">Terug</a>
	<a href="/ongeveer/tallysheet/{data.tallySheet.id}/edit">Bewerken</a>
	{#if data.isProcessed}
		<button disabled>Maak transacties</button>
	{:else}
		<a href="/ongeveer/tallysheet/{data.tallySheet.id}/process">Maak transacties</a>
	{/if}
</div>

<h2>Info</h2>
<table>
	<tbody>
		<tr>
			<td>ID</td>
			<td>{data.tallySheet.id}</td>
		</tr>
		<tr>
			<td>Invoer datum</td>
			<td>{formatDateTimeHumanReadable(new Date(data.tallySheet.createdAt))}</td>
		</tr>
		<tr>
			<td>Begin datum</td>
			<td>{data.tallySheet.startDate ? formatDateHumanReadable(new Date(data.tallySheet.startDate)) : '-'}</td>
		</tr>
		<tr>
			<td>Eind datum</td>
			<td>{data.tallySheet.endDate ? formatDateHumanReadable(new Date(data.tallySheet.endDate)) : '-'}</td>
		</tr>
		<tr>
			<td>Verwerkt</td>
			<td>{data.isProcessed ? 'Ja' : 'Nee'}</td>
		</tr>
		<tr>
			<td>Penningmeester</td>
			<td>{data.tallySheet.treasurer?.firstName ?? '-'}</td>
		</tr>
		<tr>
			<td>Notes</td>
			<td>{data.tallySheet.notes ?? '-'}</td>
		</tr>
	</tbody>
</table>

<h2>Streeplijst</h2>
<table>
	<thead>
		<tr>
			<th>Boekstuk</th>
			<th>Persoon</th>
			<th>Product</th>
			<th>Hoeveelheid</th>
			<th>Prijs p/s</th>
		</tr>
	</thead>
	<tbody>
		{#each data.tallySheet.sales as sale}
			{#each sale.Rows as row}
				<tr>
					<td><a href="/ongeveer/journal/{sale.id}">{sale.id}</a></td>
					<td>{sale.relation.name}</td>
					<td>{row.description}</td>
					<td>{row.amount}</td>
					<td>{row.price}</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>

<style>
	h2 {
		margin-top: 1rem;
	}
</style>
