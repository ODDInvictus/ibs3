<script lang="ts">
	import type { PageData } from './$types';
	import { intProxy, superForm } from 'sveltekit-superforms/client';
	import Title from '$lib/components/title.svelte';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import validators from './relationSchema';
	import Submit from '$lib/superforms/Submit.svelte';
	import { onError } from '$lib/superforms/error';

	export let data: PageData;

	const formProps = superForm(data.form, {
		validators,
		onError
	});
	const { form, enhance } = formProps;
	const idProxy = intProxy(form, 'id');
</script>

<Title title="Relatie {$form.id ? `${$form.name} bewerken` : 'aanmaken'}" />

<form class="superform" method="POST" use:enhance>
	<SuperField {formProps} field="name">Naam</SuperField>

	<SuperField {formProps} field="description">Omschrijving</SuperField>

	<SuperField {formProps} field="iban">IBAN</SuperField>

	<SuperField {formProps} field="address">Adres</SuperField>

	<SuperField {formProps} field="postalCode">Postcode</SuperField>

	<SuperField {formProps} field="city">Stad</SuperField>

	<SuperField {formProps} field="email">Email</SuperField>

	<input type="hidden" name="id" bind:value={$idProxy} />

	<Submit {formProps}>{$form.id ? 'Opslaan' : 'Aanmaken'}</Submit>
</form>
