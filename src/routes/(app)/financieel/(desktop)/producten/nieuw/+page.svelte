<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import StyledButton from '$lib/components/StyledButton.svelte';

	function mapProductType(productType: string) {
		switch (productType) {
			case 'ALCOHOL':
				return 'Alcohol-houdend';
			case 'FOOD':
				return 'Etenswaren';
			case 'OTHER':
				return 'Anders';
			default:
				return productType;
		}
	}

	let productType = $page.data.productTypes[0];
</script>

<div id="root">
	<h1>Nieuw product</h1>

	<form
		method="POST"
		use:enhance={({ form, data, action, cancel }) => {
			return async ({ result }) => {
				if (result.type === 'error') {
				}
			};
		}}
	>
		<label for="name">Naam</label>
		<input type="text" name="name" id="name" />

		<label for="description">Beschrijving</label>
		<input type="text" name="description" id="description" />

		<label for="price">Prijs</label>
		<input type="number" step="0.01" name="price" id="price" />

		<label for="category">Categorie</label>
		<select name="category" id="category">
			{#each $page.data.categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>

		<label for="productType">Product Type</label>
		<select name="productType" id="productType" value={productType}>
			{#each $page.data.productTypes as productType}
				<option value={productType}>{mapProductType(productType)}</option>
			{/each}
		</select>

		<label for="isActive">Actief?</label>
		<input type="checkbox" name="isActive" id="isActive" checked />

		<button type="submit"> Opslaan </button>
	</form>
</div>

<style lang="scss">
	#root {
		display: block;
	}

	h1 {
		font-size: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
	}

	button {
		margin-top: 1rem;
	}
</style>
