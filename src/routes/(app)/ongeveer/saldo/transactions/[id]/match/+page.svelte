<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { onError, onResult } from '$lib/superforms/error';
	import { matchSaldoTransaction } from './matchSaldoTransaction';
	import Plus from '~icons/tabler/plus';
	import Trashcan from '~icons/tabler/trash';
	import { toast } from '$lib/notification';
	import Submit from '$lib/superforms/Submit.svelte';
	import { formatPrice } from '$lib/textUtils';

	export let data: PageData;

	const formProps = superForm(data.form, {
		onError,
		onResult,
		validators: matchSaldoTransaction,
		dataType: 'json'
	});
	const { form, errors, enhance } = formProps;

	function addRow() {
		console.log('addRow');
		if (data.journals.length === 0) {
			return toast({
				title: 'Geen boekstukken',
				message: 'Voeg eerst een boekstuk toe',
				type: 'danger'
			});
		}

		$form.rows = [
			...$form.rows,
			{
				amount: NaN,
				description: '',
				journal: data.journals[0].id
			}
		];
	}
</script>

<Title title="Match saldo transactie" />

<form method="post" class="superform" use:enhance>
	<table>
		<thead>
			<th>Omschrijving</th>
			<th>Amount</th>
			<th>Boekstuk</th>
			<th />
		</thead>
		<tbody>
			{#if data.transaction.TransactionMatchRow}
				{@const row = data.transaction.TransactionMatchRow}
				<tr>
					<td>{row.description || '-'}</td>
					<td>{formatPrice(row.amount)}</td>
					<td>
						<a href="/ongeveer/transaction/{row.transactionId}">Transactie #{row.transactionId}</a>
					</td>
					<td />
				</tr>
			{/if}
			{#each $form.rows as _, i}
				<tr>
					<td>
						<input
							type="text"
							class:has-error={$errors.rows?.[i]?.description}
							bind:value={$form.rows[i].description}
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							class:has-error={$errors.rows?.[i]?.amount}
							bind:value={$form.rows[i].amount}
						/>
					</td>
					<td>
						<select class:has-error={$errors.rows?.[i]?.journal} bind:value={$form.rows[i].journal}>
							{#each data.journals ?? [] as journal}
								<option value={journal.id}>
									{journal.id}{journal.ref ? ` - ${journal.ref}` : ''} ({journal.type.toLowerCase()})
								</option>
							{/each}
						</select>
					</td>
					<td>
						{#if i === $form.rows.length - 1}
							<button type="button" on:click={addRow}>
								<Plus />
							</button>
						{/if}
						<button
							type="button"
							on:click={() => {
								const filtered = [...$form.rows];
								filtered.splice(i, 1);
								$form.rows = filtered;
							}}><Trashcan /></button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if $form.rows.length === 0}
		<button type="button" class="bottom-btn" on:click={addRow}>
			<Plus />
		</button>
	{/if}

	<Submit {formProps}>Opslaan</Submit>
</form>

<style>
	table,
	.bottom-btn {
		margin-bottom: 1rem;
	}
</style>
