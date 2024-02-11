<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title={data.transaction ? 'Transactie' : 'Niet gevonden'} />

<div class="ongeveer-nav">
	<a href="/ongeveer/saldo/transactions">Terug</a>
</div>

<h2>Info</h2>

<table>
	<tr>
		<td>ID</td>
		<td>{data.transaction.id}</td>
	</tr>
	<tr>
		<td>Van</td>
		<td>
			<a href="/ongeveer/relations/{data.transaction.fromId}">{data.transaction.from.name}</a>
		</td>
	</tr>
	<tr>
		<td>Naar</td>
		<td>
			<a href="/ongeveer/relations/{data.transaction.toId}">{data.transaction.to.name}</a>
		</td>
	</tr>
	<tr>
		<td>Prijs</td>
		<td>€ {Number(data.transaction.price).toFixed(2)}</td>
	</tr>
	<tr>
		<td>Omschrijving</td>
		<td>{data.transaction.description}</td>
	</tr>
	<tr>
		<td>Datum</td>
		<td>{formatDateTimeHumanReadable(new Date(data.transaction.Transaction.createdAt))}</td>
	</tr>
</table>

{#if data.transaction.TransactionMatchRow}
	{@const matched = data.transaction.TransactionMatchRow.Transaction}
	<h2>Gematchde transactie</h2>
	<table>
		<tr>
			<td>ID</td>
			<td><a href="/ongeveer/transaction/{matched.id}">{matched.id}</a></td>
		</tr>
		<tr>
			<td>Type</td>
			<td>{matched.type}</td>
		</tr>
	</table>
{/if}

{#if data.transaction.Transaction.TransactionMatchRow.length > 0}
	{@const rows = data.transaction.Transaction.TransactionMatchRow}

	<h2>Gematchde boekstukken</h2>

	<table>
		<thead>
			<th>Boekstuknummer</th>
			<th>Beschrijving</th>
			<th>Bedrag</th>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					<td><a href="/ongeveer/journal/{row.journalId}">{row.journalId}</a></td>
					<td>{row.description}</td>
					<td>€ {Number(row.amount).toFixed(2)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style lang="scss">
	h2 {
		margin-top: 1rem;
	}
</style>
