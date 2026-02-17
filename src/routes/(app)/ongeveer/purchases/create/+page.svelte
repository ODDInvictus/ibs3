<!-- @migration-task Error while migrating Svelte code: `<th>` cannot be a child of `<thead>`. `<thead>` only allows these children: `<tr>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { intProxy, superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import SuperField from '$lib/superforms/SuperField.svelte'
	import SuperSelect from '$lib/superforms/SuperSelect.svelte'
	import validators from './pruchaseSchema'
	import { onError } from '$lib/superforms/error'
	import Submit from '$lib/superforms/Submit.svelte'
	import DeleteButton from '$lib/ongeveer/DeleteButton.svelte'
	import { formatMoney } from '$lib/utils'
	import Attatchment from '$lib/ongeveer/Attatchment.svelte'
	import Plus from '~icons/tabler/plus'
	import Trashcan from '~icons/tabler/trash'
	import { toast } from '$lib/notification'

	export let data: PageData

	const formProps = superForm(data.form, {
		dataType: 'json',
		validators,
		onError,
		onSubmit: ({ formData }) => {
			formData.set('toDelete', JSON.stringify(toDelete))
		},
	})

	const { form, errors, enhance, tainted } = formProps

	const idProxy = intProxy(form, 'id')

	let attatchments: FileList
	let previews: { filename: string; src: string; MIMEtype?: string; size?: string }[] = data.attachments

	$: if (attatchments) {
		showAttatchments()
	}

	function showAttatchments() {
		if (!attatchments || attatchments.length === 0) return
		previews = data.attachments.filter(attatchment => !toDelete.includes(attatchment.filename))

		for (const attatchment of attatchments) {
			const reader = new FileReader()

			reader.onload = event => {
				previews = [
					...previews,
					{
						src: event.target?.result?.toString() ?? '',
						filename: attatchment.name,
						MIMEtype: attatchment.type,
						size: attatchment.size + '',
					},
				]
			}

			reader.readAsDataURL(attatchment)
		}
	}

	let toDelete: string[] = []
</script>

<Title title="Aankoop boeking" />

<form class="superform" method="POST" use:enhance enctype="multipart/form-data">
	<input name="id" type="hidden" bind:value={$idProxy} />

	<SuperField {formProps} field="ref">Referentie</SuperField>

	<SuperField type="date" {formProps} field="date">Factuur datum</SuperField>

	<SuperField type="number" {formProps} field="termsOfPayment">Betalingstermijn</SuperField>

	<SuperSelect {formProps} field="relation" options={data.relations.map(({ id, name }) => [id, name])}>Relatie</SuperSelect>

	<SuperSelect
		{formProps}
		field="type"
		options={[
			['PURCHASE', 'Aankoop'],
			['DECLARATION', 'Declaratie'],
		]}>Type</SuperSelect>

	{#if data.declarationData}
		<hr />
		<div class="input-group">
			<label for="">Betaalmethode</label>
			<input type="text" disabled value={data.declarationData.methodOfPayment} />
		</div>
		<div class="input-group">
			<label for="">Ontvangmethode</label>
			<input type="text" disabled value={data.declarationData.receiveMethod === 'SALDO' ? 'Saldo' : 'Bankrekening'} />
		</div>
		{#if data.declarationData.iban}
			<div class="input-group">
				<label for="">IBAN</label>
				<input type="text" disabled value={data.declarationData.iban} />
			</div>
		{/if}
		<div class="input-group">
			<label for="">Gevraagde hoeveelheid</label>
			<input type="text" disabled value={formatMoney(data.declarationData.askedAmount)} />
		</div>
		<div class="input-group">
			<label for="">Status</label>
			<input type="text" disabled value={data.declarationData.status} />
		</div>
	{/if}
	<!-- Wie dit leest trekt bak-->
	<!-- Ja gotver -->
	<!-- Verdomme kut naut -->
	<!-- TODO extract into component smth idk -->
	<hr />
	<table>
		<thead>
			<tr>
				<th>Omschrijving</th>
				<th>Hoeveelheid</th>
				<th>Prijs</th>
				<th>Grootboek</th>
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
						<input type="number" class:has-error={$errors.rows?.[i]?.amount} bind:value={$form.rows[i].amount} step="1" />
					</td>
					<td>
						<input type="number" class:has-error={$errors.rows?.[i]?.price} bind:value={$form.rows[i].price} step="0.01" />
					</td>
					<td>
						<select name="ledger" class:has-error={$errors.rows?.[i]?.ledger} bind:value={$form.rows[i].ledger}>
							{#each data.ledgers ?? [] as ledger}
								<option value={ledger.id}>{ledger.id} - {ledger.name}</option>
							{/each}
						</select>
					</td>
					<td>
						{#if i === $form.rows.length - 1}
							<button type="button" on:click={() => ($form.rows = [...$form.rows, { description: '', amount: 0, price: 0, ledger: 0 }])}>
								<Plus />
							</button>
						{/if}
						{#if $form.rows.length > 1}
							<button
								type="button"
								on:click={() => {
									const filtered = [...$form.rows]
									filtered.splice(i, 1)
									$form.rows = filtered
								}}><Trashcan /></button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="bottom">
		<div class="btns">
			<Submit {formProps}>Opslaan</Submit>
			{#if data.declarationData?.status === 'PENDING'}
				<button
					class:disabled={!!$tainted}
					type="button"
					on:click={async () => {
						if (!!$tainted) {
							return toast({
								title: 'Wijzigingen',
								message: 'Sla de wijzigingen eerst op',
								type: 'danger',
							})
						}

						if (!confirm('Weet je zeker dat je deze declaratie wilt goedkeuren?')) return

						const res = await fetch(`/ongeveer/purchases/${$idProxy}`, {
							method: 'PATCH',
						})
						if (res.ok) {
							location.href = '/ongeveer/purchases'
						} else {
							toast({
								title: res.statusText,
								message: await res.text(),
								type: 'danger',
							})
						}
					}}>Goedkeuren en transactie maken</button>
			{/if}
			{#if $idProxy}
				<DeleteButton
					url={`/ongeveer/purchases/${$idProxy}${data.declarationData?.status === 'PENDING' ? '?type=declaration' : ''}`}
					redirect="/ongeveer/purchases"
					confirmMessage="Weet je zeker dat je dit boekstuk wilt verwijderen?"
					text={data.declarationData?.status === 'PENDING' ? 'Afwijzen en verwijderen' : 'Verwijderen'} />
			{/if}
		</div>
		<div class="attachments">
			<h1>Bijlagen</h1>
			<input type="file" name="attachments" multiple bind:files={attatchments} />
			{#if previews.length > 0}
				<Attatchment {previews} bind:toDelete />
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
	}

	input:disabled,
	.disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}
</style>
