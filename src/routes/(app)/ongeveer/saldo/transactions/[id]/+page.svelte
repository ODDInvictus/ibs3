<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import { formatPrice } from '$lib/textUtils';

	export let data: PageData;
</script>

<Title title={data.transaction ? 'Transactie' : 'Niet gevonden'} />

<div class="ongeveer-nav">
	<a href="/ongeveer/saldo/transactions">Terug</a>
	{#if data.shouldMatch}
		<a href="/ongeveer/saldo/transactions/{data.transaction.id}/match">Match</a>
	{/if}
</div>

<h2>Info</h2>

<table>
	<tr>
		<td>Saldo transactienummer</td>
		<td>#{data.transaction.id}</td>
	</tr>
	<tr>
		<td>Transactienummer</td>
		<td>#{data.transaction.Transaction.id}</td>
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
		<td>Bedrag</td>
		<td>{formatPrice(data.transaction.price)}</td>
	</tr>
	<tr>
		<td>Omschrijving</td>
		<td>{data.transaction.description}</td>
	</tr>
	<tr>
		<td>Datum</td>
		<td>{formatDateTimeHumanReadable(new Date(data.transaction.Transaction.createdAt))}</td>
	</tr>
	<tr>
		<td>Status</td>
		<td>{data.status}</td>
	</tr>
</table>

<h2>Gematchde boekstukken</h2>

<table>
	<thead>
		<th>Boekstuknummer</th>
		<th>Beschrijving</th>
		<th>Bedrag</th>
	</thead>
	<tbody>
		{#each data.transaction.Transaction.TransactionMatchRow as row}
			<tr>
				<td><a href="/ongeveer/journal/{row.journalId}">{row.journalId}</a></td>
				<td>{row.description}</td>
				<td>{formatPrice(row.amount)}</td>
			</tr>
		{/each}

		{#if data.transaction.TransactionMatchRow}
			{@const matched = data.transaction.TransactionMatchRow}
			<tr>
				<td>
					<a href="/ongeveer/transaction/{matched.id}">Transactie #{matched.transactionId}</a>
				</td>
				<td>{matched.description}</td>
				<td>{formatPrice(matched.amount)}</td>
			</tr>
		{:else if data.transaction.Transaction.TransactionMatchRow.length === 0}
			<td colspan="3">Er is nog niks gematcht aan deze transactie</td>
		{/if}

		<tr>
			<td />
			<td><i>Totaal</i></td>
			<td>
				<i>
					{formatPrice(data.totalMatched)}
				</i>
			</td>
		</tr>
	</tbody>
</table>

<style lang="scss">
	h2 {
		margin-top: 1rem;
	}
</style>
