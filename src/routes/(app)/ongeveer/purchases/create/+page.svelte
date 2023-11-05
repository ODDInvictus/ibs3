<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { intProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import SuperSelect from '$lib/superforms/SuperSelect.svelte';
	import validators from './pruchaseSchema';
	import { onError } from '$lib/superforms/error';
	import Submit from '$lib/superforms/Submit.svelte';
	import DeleteButton from '$lib/ongeveer/DeleteButton.svelte';
	import { formatFileSize } from '$lib/utils';

	export let data: PageData;

	const formProps = superForm(data.form, {
		dataType: 'json',
		validators,
		onError,
		onSubmit: ({ formData }) => {
			formData.set('toDelete', JSON.stringify(toDelete));
		}
	});

	const { form, errors, enhance } = formProps;

	const idProxy = intProxy(form, 'id');

	let attatchments: FileList;
	let previews: { src: string; MIMEtype: string; size: string; name: string }[] = data.attachments;

	$: if (attatchments) {
		showAttatchments();
	}

	function showAttatchments() {
		if (!attatchments || attatchments.length === 0) return;
		previews = [...data.attachments];

		for (const attatchment of attatchments) {
			const reader = new FileReader();

			reader.onload = (event) => {
				previews = [
					...previews,
					{
						src: event.target?.result?.toString() ?? '',
						MIMEtype: attatchment.type,
						size: formatFileSize(attatchment.size),
						name: attatchment.name
					}
				];
			};

			reader.readAsDataURL(attatchment);
		}
	}

	let toDelete: string[] = [];
	let selected = 0;
</script>

<Title title="Aankoop boeking" />

<form class="superform" method="POST" use:enhance enctype="multipart/form-data">
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
			['DECLARATION', 'Declaratie']
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
							class:has-error={$errors.rows?.[i]?.description}
							bind:value={$form.rows[i].description}
						/>
					</td>
					<td>
						<input
							type="number"
							class:has-error={$errors.rows?.[i]?.amount}
							bind:value={$form.rows[i].amount}
							min="0"
							step="1"
						/>
					</td>
					<td>
						<input
							type="number"
							class:has-error={$errors.rows?.[i]?.price}
							bind:value={$form.rows[i].price}
							min="0"
							step="0.01"
						/>
					</td>
					<td>
						<select
							name="ledger"
							class:has-error={$errors.rows?.[i]?.ledger}
							bind:value={$form.rows[i].ledger}
						>
							{#each data.ledgers ?? [] as ledger}
								<option value={ledger.id}>{ledger.name}</option>
							{/each}
						</select>
					</td>
					<td>
						<!-- TODO use icons -->
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

	<div class="bottom">
		<div class="btns">
			<Submit {formProps}>Opslaan</Submit>
			{#if $idProxy}
				<DeleteButton url={`/ongeveer/purchases/${$idProxy}`} redirect="/ongeveer/purchases" />
			{/if}
		</div>
		<div class="attachments">
			<h1>Bijlagen</h1>
			<input type="file" name="attachments" multiple bind:files={attatchments} />
			{#if previews.length > 0}
				<div class="preview">
					<div class="selector">
						{#each previews as preview, i}
							<button class="nav-item btn-secondary" class:selected={selected === i} type="button">
								<span on:click={() => (selected = i)} class="select">
									{preview.name.match(/^purchase-\d+-.*/)
										? preview.name.split('-').slice(2).join('-')
										: preview.name}
								</span>
								<span
									on:click={() => {
										toDelete = [...toDelete, previews[i].name];
										previews = previews.filter((_, j) => j !== i);
									}}
								>
									x
								</span>
							</button>
						{/each}
					</div>
					<p class="small">{previews[selected].name} ({previews[selected].size})</p>
					{#if previews[selected].MIMEtype.startsWith('image/')}
						<img src={previews[selected].src} alt={previews[selected].name} />
					{:else if previews[selected].MIMEtype === 'application/pdf'}
						<iframe src={previews[selected].src} title={previews[selected].name} />
					{:else}
						<a href={previews[selected].src} download={previews[selected].name}>Download</a>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</form>

<style lang="scss">
	.bottom {
		display: flex;
		gap: 2rem;
		margin-top: 1rem;
	}

	.btns {
		display: inline-flex;
		gap: 1rem;
		height: fit-content;
	}

	.attachments {
		width: 100%;

		iframe,
		img {
			width: 100%;
			max-width: 600px;
		}

		iframe {
			height: 800px;
		}

		img {
			object-fit: contain;
			object-position: left top;
			border: 3px solid gray;
			max-height: 800px;
		}

		.nav-item {
			cursor: default;
			display: flex;

			.select {
				margin-right: 1ex;
			}

			span {
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}

			&:hover {
				text-decoration: none;
			}

			&.selected {
				outline: 3px solid var(--color-primary);
			}
		}

		.small {
			font-size: 0.8rem;
		}

		.selector {
			display: flex;
			flex-direction: row;
			widows: 100%;
			gap: 1ex;
			margin: 1rem 0;
		}

		.preview {
			display: flex;
			flex-direction: column;
		}
	}
</style>
