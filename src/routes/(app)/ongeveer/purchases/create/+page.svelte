<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { dateProxy, intProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import Label from '$lib/superforms/Label.svelte';
	import SuperSelect from '$lib/superforms/SuperSelect.svelte';

	export let data: PageData;

	const formProps = superForm(data.form, {
		dataType: 'json'
	});

	const { form, errors, enhance, constraints } = formProps;

	const invoiceDateProxy = dateProxy(form, 'date');
	const termsOfPaymentProxy = intProxy(form, 'termsOfPayment');
	const idProxy = intProxy(form, 'id');
</script>

<Title title="Aankoop boeking" />

<form class="superform" method="POST" use:enhance>
	<input name="id" type="hidden" bind:value={$idProxy} />

	<SuperField {formProps} field="ref">Referentie</SuperField>

	<SuperField type="date" {formProps} field="date">Factuur datum</SuperField>

	<SuperField type="number" {formProps} field="termsOfPayment">Betalingstermijn</SuperField>

	<SuperSelect
		{formProps}
		field="relation"
		options={data.relations.map(({ id, name }) => [id, name])}>Relatie</SuperSelect
	>

	<SuperSelect
		{formProps}
		field="type"
		options={[
			['PURCHASE', 'Aankoop'],
			['DECLERATION', 'Declaratie']
		]}>Type</SuperSelect
	>
	<!-- TODO extract into component smth idk -->
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
