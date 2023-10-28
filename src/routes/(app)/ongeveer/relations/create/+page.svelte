<script lang="ts">
	import type { PageData } from './$types';
	import { intProxy, superForm } from 'sveltekit-superforms/client';
	import Title from '$lib/components/title.svelte';
	import SuperTextField from '$lib/superforms/SuperTextField.svelte';
	import validators from './relationSchema';

	export let data: PageData;

	// TODO handle errors not bound to field
	// https://superforms.rocks/concepts/error-handling
	const formProps = superForm(data.form, { validators });
	const { form, enhance, delayed } = formProps;
	const idProxy = intProxy(form, 'id');

	const x = Object.entries(validators.shape);
	console.log(x);
</script>

<Title title="Relatie {$form.id ? `${$form.name} bewerken` : 'aanmaken'}" />

<form class="superform" method="POST" use:enhance>
	<SuperTextField {formProps} field="name">Naam</SuperTextField>

	<SuperTextField {formProps} field="description">Omschrijving</SuperTextField>

	<SuperTextField {formProps} field="iban">IBAN</SuperTextField>

	<SuperTextField {formProps} field="address">Adres</SuperTextField>

	<SuperTextField {formProps} field="postalCode">Postcode</SuperTextField>

	<SuperTextField {formProps} field="city">Stad</SuperTextField>

	<SuperTextField {formProps} field="email">Email</SuperTextField>

	<input type="hidden" name="id" bind:value={$idProxy} />

	<button type="submit">{$form.id ? 'Opslaan' : 'Aanmaken'}</button>
	{#if $delayed}
		<!-- TODO Extract to component -->
		<p>Loading...</p>
	{/if}
</form>
