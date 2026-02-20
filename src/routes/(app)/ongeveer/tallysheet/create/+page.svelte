<!-- @migration-task Error while migrating Svelte code: Cannot subscribe to stores that are not declared at the top level of the component
https://svelte.dev/e/store_invalid_scoped_subscription -->
<script lang="ts">
	// import SuperField from '$lib/superforms/SuperField.svelte'
	// import Submit from '$lib/superforms/Submit.svelte'
	// import Trash from '~icons/tabler/trash'
	// import type { PageData, PageProps } from './$types'
	import Callout from '$lib/components/callout.svelte'
	import Title from '$lib/components/title.svelte'
	// import { superForm } from 'sveltekit-superforms/client'
	// import AutoComplete from 'simple-svelte-autocomplete'
	// import { onError, onResult } from '$lib/superforms/error'
	// import { tallySheetSchema } from './tallySheetSchema'

	// let { data }: PageProps = $props()

	// const { form, enhance, errors, ...rest } = superForm(data.form, {
	// 	dataType: 'json',
	// 	validators: tallySheetSchema,
	// 	onError,
	// 	onResult,
	// })

	// const formProps = { form, enhance, errors, ...rest }

	// const defaultAutoCompleteProps = {
	// 	labelFieldName: 'name',
	// 	valueFieldName: 'id',
	// 	maxItemsToShowInList: 3,
	// 	hideArrow: true,
	// 	noResultsText: 'Geen resultaten',
	// 	moreItemsText: 'meer resultaten',
	// 	minCharactersToSearch: 2,
	// 	onFocus: () => {
	// 		const latest = $form.rows[$form.rows.length - 1]
	// 		if (isEmpty(latest)) {
	// 			addNewRow()
	// 		}
	// 	},
	// }

	// const addNewRow = () => {
	// 	$form.rows = [...$form.rows, { amount: NaN, productId: NaN, financialPersonId: NaN }]
	// }

	// const isEmpty = ({ amount, productId, financialPersonId }: { amount: any; productId: any; financialPersonId: any }) => {
	// 	return (
	// 		!Number.isNaN(Number(amount ?? undefined)) ||
	// 		!Number.isNaN(Number(productId ?? undefined)) ||
	// 		!Number.isNaN(Number(financialPersonId ?? undefined))
	// 	)
	// }

	// const noType = (x: any) => x
</script>

<Title title="Streeplijst verwerken" />

<Callout type="caution">18-2-2026: deze pagina heeft de migratie naar svelte 5 niet overleefd - Niels</Callout>

<!-- <form class="superform" method="POST" use:enhance>
	<SuperField type="date" {formProps} field="start">Begin streeplijst</SuperField>
	<SuperField type="date" {formProps} field="end">Einde streeplijst</SuperField>
	<SuperField type="textarea" {formProps} field="notes">Notes</SuperField>
	<table>
		<thead>
			<th>Persoon</th>
			<th>Product</th>
			<th>Hoeveelheid</th>
			<th>Prijs p/s</th>
			<th></th>
		</thead>
		<tbody>
			{#each $form.rows as _, i}
				{@const errorRows = noType($errors?.rows)}
				{@const errors = errorRows?.hasOwnProperty(i.toString()) ? errorRows[i.toString()] : undefined}
				<tr>
					<td>
						<AutoComplete
							items={data.financialPersons}
							bind:value={$form.rows[i].financialPersonId}
							keywordsFunction={item => [item.name, item.FinancialPersonDataUser?.user?.nickname ?? ''].join(' ')}
							inputClassName={errors?.financialPersonId ? 'has-error' : ''}
							{...defaultAutoCompleteProps} />
					</td>
					<td>
						<AutoComplete
							items={data.products}
							bind:value={$form.rows[i].productId}
							inputClassName={errors?.productId ? 'has-error' : ''}
							{...defaultAutoCompleteProps} />
					</td>
					<td>
						<input type="number" bind:value={$form.rows[i].amount} class:has-error={errors?.amount} />
					</td>
					<td>
						<input type="number" disabled value={data.products.find(({ id }) => id === $form.rows[i].productId)?.price} />
					</td>
					<td
						><i
							on:click={() => {
								const filtered = [...$form.rows]
								filtered.splice(i, 1)
								$form.rows = filtered
							}}><Trash /></i
						></td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="btns">
		<button on:click={addNewRow} type="button"> Add row </button>
		<Submit {formProps}>Opslaan</Submit>
	</div>
</form> -->

<style lang="scss">
	.btns {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
