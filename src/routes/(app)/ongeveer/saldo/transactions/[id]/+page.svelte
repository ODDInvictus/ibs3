<script lang="ts">
	import type { PageData } from './$types';

	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title={data.transaction ? 'Transactie' : 'Niet gevonden'} />
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
		<td>{formatDateTimeHumanReadable(data.transaction.Transaction.createdAt)}</td>
	</tr>
	{#if data.transaction.TransactionMatchRow}
		{@const matched = data.transaction.TransactionMatchRow.Transaction}
		<tr>
			<td>Matched transaction</td>
			<td><a href="/ongeveer/transaction/{matched.id}">{matched.type} - {matched.id}</a></td>
		</tr>
	{/if}
</table>
<div class="links">
	<a href="/ongeveer/saldo/transactions" class="button">Terug</a>
</div>

<style>
	.links {
		padding: 2rem 1rem;
	}
</style>
