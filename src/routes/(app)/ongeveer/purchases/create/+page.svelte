<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { dateProxy, intProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import SuperTextField from '$lib/superforms/SuperTextField.svelte';
	import SuperDateField from '$lib/superforms/SuperDateField.svelte';
	import SuperNumberField from '$/lib/superforms/SuperNumberField.svelte';
	import Label from '$/lib/superforms/Label.svelte';

	export let data: PageData;

	const { form, errors, enhance, constraints } = superForm(data.form, {
		dataType: 'json'
	});

	const invoiceDateProxy = dateProxy(form, 'date');
	const termsOfPaymentProxy = intProxy(form, 'termsOfPayment');
	const idProxy = intProxy(form, 'id');

	$form.rows = $form.rows.length
		? $form.rows
		: [{ description: '', amount: 0, price: 0, ledger: 0 }];
</script>

<Title title="Aankoop boeking" />

<form class="superform" method="POST" use:enhance>
	<input name="id" type="hidden" bind:value={$idProxy} />

	<SuperTextField
		name="ref"
		bind:value={$form.ref}
		errors={$errors.ref}
		constraints={$constraints.ref}
	>
		Referentie
	</SuperTextField>

	<SuperDateField
		name="date"
		bind:value={$invoiceDateProxy}
		errors={$errors.date}
		constraints={$constraints.date}
	>
		Datum
	</SuperDateField>

	<SuperNumberField
		name="termsOfPayment"
		bind:value={$termsOfPaymentProxy}
		errors={$errors.termsOfPayment}
		constraints={$constraints.termsOfPayment}
	>
		Betalingstermijn
	</SuperNumberField>

	<!-- TODO extract relation select and group options -->
	<div class="input-group">
		<Label name="relation" constraints={{ required: true }}>Relatie</Label>
		<select name="relation">
			{#each data.relations ?? [] as relation}
				<option value={relation.id}>{relation.name}</option>
			{/each}
		</select>
	</div>

	<div class="input-group">
		<Label name="type" constraints={{ required: true }}>Type</Label>
		<select name="type">
			<option value="PURCHASE">Aankoop</option>
			<option value="DECLARATION">Declaratie</option>
		</select>
	</div>

	<table>
		<thead>
			<th>Omschrijving</th>
			<th>Hoeveelheid</th>
			<th>Prijs</th>
			<th>Grootboek</th>
			<th />
		</thead>
		<tbody>
			{#each $form.rows as _, i}
				<tr>
					<td>
						<input
							type="text"
							data-invalid={$errors.rows?.[i]?.description}
							bind:value={$form.rows[i].description}
						/>
					</td>
					<td>
						<input
							type="number"
							data-invalid={$errors.rows?.[i]?.amount}
							bind:value={$form.rows[i].amount}
							min="0"
							step="1"
						/>
					</td>
					<td>
						<input
							type="number"
							data-invalid={$errors.rows?.[i]?.price}
							bind:value={$form.rows[i].price}
							min="0"
							step="0.01"
						/>
					</td>
					<td>
						<select name="ledger">
							{#each data.ledgers ?? [] as ledger}
								<option value={ledger.id}>{ledger.name}</option>
							{/each}
						</select>
					</td>
					<td>
						{#if i === $form.rows.length - 1}
							<button
								type="button"
								on:click={() =>
									($form.rows = [
										...$form.rows,
										{ description: '', amount: 0, price: 0, ledger: 0 }
									])}
							>
								Add
							</button>
						{/if}
						{#if $form.rows.length > 1}
							<button
								type="button"
								on:click={() => {
									const filtered = [...$form.rows];
									filtered.splice(i, 1);
									$form.rows = filtered;
								}}>Del</button
							>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<button type="submit">Opslaan</button>
</form>
