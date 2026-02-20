<script lang="ts">
	import type { PageData } from './$types'
	import { onError } from '$lib/superforms/error'
	import { getProductSchema } from './productSchema'
	import { intProxy, superForm } from 'sveltekit-superforms/client'
	import SuperField from '$lib/superforms/SuperField.svelte'
	import SuperSelect from '$lib/superforms/SuperSelect.svelte'
	import Submit from '$lib/superforms/Submit.svelte'
	import Title from '$lib/components/title.svelte'

	function mapProductType(productType: string) {
		switch (productType) {
			case 'ALCOHOL':
				return 'Alcohol-houdend'
			case 'FOOD':
				return 'Etenswaren'
			case 'OTHER':
				return 'Anders'
			default:
				return productType
		}
	}

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const formProps = superForm(data.form, {
		// Zod schema for client side validation
		validators: getProductSchema(data.productTypes),
		// Error handeler for thrown errors (403, 500 etc.)
		onError,
	})
	const { form, enhance } = formProps

	const idProxy = intProxy(form, 'id')
</script>

<Title title="Product aanmaken" />

<form method="POST" use:enhance class="superform">
	<input type="hidden" name="id" bind:value={$idProxy} />
	<SuperField {formProps} field="name">Naam</SuperField>
	<SuperField {formProps} field="description">Beschrijving</SuperField>
	<SuperField type="number" {formProps} field="price">Prijs</SuperField>

	<SuperSelect {formProps} field="categoryId" options={data.categories.map(({ id, name }) => [id, name])}>Categorie</SuperSelect>

	<SuperSelect {formProps} field="productType" options={data.productTypes.map(productType => [productType, mapProductType(productType)])}
		>Product Type</SuperSelect>

	<SuperField type="checkbox" {formProps} field="isActive">Actief?</SuperField>

	<Submit {formProps}>Opslaan</Submit>
</form>
