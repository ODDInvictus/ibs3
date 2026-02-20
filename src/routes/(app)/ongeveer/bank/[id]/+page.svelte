<!-- @migration-task Error while migrating Svelte code: `<th>` cannot be a child of `<thead>`. `<thead>` only allows these children: `<tr>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import { onError, onResult } from '$lib/superforms/error'
	import { matchTransactionSchema } from './matchTransaction'
	import Title from '$lib/components/title.svelte'
	import SuperField from '$lib/superforms/SuperField.svelte'
	import SuperSelect from '$lib/superforms/SuperSelect.svelte'
	import Plus from '~icons/tabler/plus'
	import Trashcan from '~icons/tabler/trash'
	import Submit from '$lib/superforms/Submit.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'

	export let data: PageData

	const formProps = superForm(data.form, {
		validators: matchTransactionSchema,
		onError,
		onResult,
		dataType: 'json',
	})

	const { form, enhance, errors } = formProps

	const relations: [string | number, string][] = data.financialPersons.map(fp => [fp.id, fp.name])
</script>

<Title title={$form.ref ?? `Banktransactie ${$form.id}`} />

<div class="info">
	<div>
		<h3>Gegevens</h3>
		<p>Bank transactie ID: {data.bankTransaction.id}</p>
		<p>Transactie ID: {data.bankTransaction.Transaction.id}</p>
		<p>Referentie: {data.bankTransaction.ref ?? '-'}</p>
		{#if data.bankTransaction.Relation}
			<p>Relatie: {data.bankTransaction.relationId} - {data.bankTransaction.Relation.name}</p>
		{/if}
	</div>

	<div>
		<h3>Bankgegevens</h3>
		<p>Amount: <b>{data.bankTransaction.amount}</b></p>
		<p>Started date: {formatDateTimeHumanReadable(new Date(data.bankTransaction.startedDate))}</p>
		<p>
			Completed date: {data.bankTransaction.completedDate ? formatDateTimeHumanReadable(new Date(data.bankTransaction.completedDate)) : ''}
		</p>
		<p>Description: {data.bankTransaction.description}</p>
		<p>Type: {data.bankTransaction.type}</p>
		<p>Product: {data.bankTransaction.product}</p>
		<p>Fee: {data.bankTransaction.fee}</p>
	</div>

	{#if data.bankTransaction.Transaction.TransactionMatchRow.some(r => r.Journal)}
		<div>
			<h3>Boekstukken</h3>
			{#each data.bankTransaction.Transaction.TransactionMatchRow as row}
				{#if row.Journal}
					<p>
						<a href="/ongeveer/journal/{row.journalId}">{row.journalId} - {row.Journal.ref}</a>
					</p>
				{/if}
			{/each}
		</div>
	{/if}

	{#if data.bankTransaction.Transaction.TransactionMatchRow.some(r => r.SaldoTransaction)}
		<div>
			<h3>Saldo transacties</h3>
			{#each data.bankTransaction.Transaction.TransactionMatchRow as row}
				{#if row.SaldoTransaction}
					<p>
						<a href="/ongeveer/saldo/transactions/{row.SaldoTransaction.id}"
							>{row.SaldoTransaction.id} - {row.SaldoTransaction.description}</a>
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<form method="post" class="superform" use:enhance>
	<SuperField type="text" {formProps} field="ref">Referentie</SuperField>
	<SuperSelect {formProps} field="relation" options={relations}>Relatie</SuperSelect>
	<hr />
	<table>
		<thead>
			<tr>
				<th>Omschrijving</th>
				<th>Bedrag</th>
				<th>Boekstuk</th>
				<th>Voeg toe aan saldo</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each $form.rows as _, i}
				<tr>
					<td>
						<input type="text" class:has-error={$errors.rows?.[i]?.description} bind:value={$form.rows[i].description} />
					</td>
					<td>
						<input type="number" step="0.01" class:has-error={$errors.rows?.[i]?.amount} bind:value={$form.rows[i].amount} />
					</td>
					<td>
						<select class:has-error={$errors.rows?.[i]?.journal} bind:value={$form.rows[i].journal}>
							<option value="" selected></option>
							{#each data.journals ?? [] as journal}
								<option value={journal.id}>
									{journal.id}{journal.ref ? ` - ${journal.ref}` : ''} ({journal.type.toLowerCase()})
								</option>
							{/each}
						</select>
					</td>
					<td>
						<input type="checkbox" bind:checked={$form.rows[i].saldo} class:has-error={$errors.rows?.[i]?.saldo} />
					</td>
					<td>
						{#if i === $form.rows.length - 1}
							<button
								type="button"
								on:click={() =>
									($form.rows = [
										...$form.rows,
										{
											amount: NaN,
											description: '',
											journal: undefined,
											saldo: false,
										},
									])}>
								<Plus />
							</button>
						{/if}
						<button
							type="button"
							on:click={() => {
								const filtered = [...$form.rows]
								filtered.splice(i, 1)
								$form.rows = filtered
							}}><Trashcan /></button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if $form.rows.length === 0}
		<button
			class="add-row"
			type="button"
			on:click={() => {
				$form.rows = [
					{
						amount: NaN,
						description: '',
						journal: undefined,
						saldo: false,
					},
				]
			}}>
			<Plus />
		</button>
	{/if}

	<Submit {formProps}>Opslaan</Submit>
</form>

<style>
	form table {
		margin-bottom: 1rem;
	}

	.info {
		display: flex;
		padding: 1rem;
		gap: 2rem;
	}

	.add-row {
		margin-bottom: 1rem;
	}
</style>
