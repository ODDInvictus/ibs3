<script lang="ts">
	import type { PageData } from './$types';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import Title from '$lib/components/title.svelte';
	import Form from '$lib/form/form.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<Title title={data.bankTransaction.ref ?? `Banktransactie ${data.bankTransaction.id}`} />
<div class="info">
	<div>
		<h3>Gegevens</h3>
		<p>ID: {data.bankTransaction.id}</p>
		<p>Referentie: {data.bankTransaction.ref}</p>
		{#if data.bankTransaction.Relation}
			<p>Relatie: {data.bankTransaction.relationId} - {data.bankTransaction.Relation.name}</p>
		{/if}
	</div>

	<div>
		<h3>Bannkgegevens</h3>
		<p>Amount: <b>{data.bankTransaction.amount}</b></p>
		<p>Started date: {formatDateTimeHumanReadable(new Date(data.bankTransaction.startedDate))}</p>
		<p>
			Completed date: {data.bankTransaction.completedDate
				? formatDateTimeHumanReadable(new Date(data.bankTransaction.completedDate))
				: ''}
		</p>
		<p>Description: {data.bankTransaction.description}</p>
		<p>Type: {data.bankTransaction.type}</p>
		<p>Product: {data.bankTransaction.product}</p>
		<p>Fee: {data.bankTransaction.fee}</p>
	</div>

	{#if data.bankTransaction.BankTransactionMatchRow.length > 0}
		<div>
			<h3>Grootboekrekeningen</h3>
			{#each data.bankTransaction.BankTransactionMatchRow as row}
				<p>
					Grootboekrekening:
					<a href="/ongeveer/ledger/{row.ledgerId}">{row.ledgerId} - {row.Ledger.name}</a>
				</p>
			{/each}
		</div>
	{/if}

	{#if data.bankTransaction.BankTransactionMatchRow.some((r) => r.Journal)}
		<div>
			<h3>Facturen</h3>
			{#each data.bankTransaction.BankTransactionMatchRow as row}
				{#if row.Journal}
					<p>
						Factuur:
						<a href="/ongeveer/sales/{row.journalId}">{row.journalId} - {row.Journal.ref}</a>
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<Form {...$page.data.form} />

<style style="scss">
	.info {
		display: flex;
		padding: 1rem;
		gap: 2rem;
	}
</style>
